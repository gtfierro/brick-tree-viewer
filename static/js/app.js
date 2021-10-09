import init, {MemoryStore} from "./pkg/oxigraph.js";
var store = '';

// demo data
var treeData = {
  name: "https://brickschema.org/schema/Brick#Class",
  disp: "Brick Root Class",
  isInstance: false,
  children: [
    //{ name: "hello" },
    //{ name: "wat" },
    //{
    //  name: "child folder",
    //  children: [
    //    {
    //      name: "child folder",
    //      children: [{ name: "hello" }, { name: "wat" }]
    //    },
    //    { name: "hello" },
    //    { name: "wat" },
    //    {
    //      name: "child folder",
    //      children: [{ name: "hello" }, { name: "wat" }]
    //    }
    //  ]
    //}
  ]
};

const app = Vue.createApp({
  data: function() {
    return {
      treeData: treeData,
      current_url: {processing: ''},
      count: 0,
    }
  },
  created: function() {
    var self = this;
    init()
        .then(() => store = new MemoryStore())
        .then(() => fetch("Brick.ttl"))
        .then(resp => resp.text())
        .then(t => {
            store.load(t, "text/turtle")
        })
        .then(() => {
            console.log("Loaded Brick");
            return fetch("artx.ttl");
        })
        .then(resp => resp.text())
        .then(t => {
            store.load(t, "text/turtle")
        })
        .then(() => {
            console.log("Loaded building");
            this.treeData.isOpen = true;
        })
        .then(() => self.populateClasses())
        .then(() => self.processing_url(''));
  },
  methods: {
    processing_url: function(url) {
        console.log(url);
        this.current_url.processing = url;
        this.$forceUpdate();
    },
    populateClasses: function() {
        this.expandClass(this.treeData, true);
    },
    expandClass: async function(item, expandAll) {
        // if children already populated, no need to update
        if (item.children?.length > 0) {
            console.log("cached!");
            return
        }
        this.processing_url(item.name);
        var query = `
        PREFIX brick: <https://brickschema.org/schema/Brick#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?class ?item WHERE {
            ?class rdfs:subClassOf <${item.name}> .
            ?item rdf:type/rdfs:subClassOf* ?class
        }`
        var counts = {};
        for (let binding of store.query(query)) {
            let uri = binding.get("class").value;
            if (counts[uri] == null) {
                counts[uri] = []
            }
            counts[uri].push(binding.get("item"));
        }
        let foundAny = false;
        for (const [uri, instances] of Object.entries(counts)) {
            foundAny = true;
            //console.log(uri, instances.length);
            this.addClass(item, uri, instances);
        }

        if (!foundAny) {
            this.addInstances(item);
        }

        // if only one child was expanded, continue expanding the tree
        if (item.children?.length == 1 || expandAll) {
            for (let child of item.children ?? []) {
                this.expandClass(child, expandAll);
            }
        }
        //this.processing_url('');
    },
    addInstances: async function(item) {
        this.processing_url(item.name);
        var query = `
        PREFIX brick: <https://brickschema.org/schema/Brick#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?item WHERE {
            ?item rdf:type <${item.name}>
        }`
        for (let binding of store.query(query)) {
            this.count++;
            this.addInstance(item, binding.get("item").value);
        }
        //this.processing_url('');
    },
    addClass: function(item, text, instances) {
      let parts = text.split(/[\/#]/);
      item.children.push({
          name: text,
          disp: parts[parts.length-1],
          count: instances.length,
          children: [],
          isInstance: false,
      });
    },
    addInstance: function(item, instance) {
      item.children?.push({
          name: instance,
          disp: instance,
          isInstance: true,
      });
    },
    handleFile: function(e, f) {
        console.log(f);
    }
  }
})

app.component("tree-item", {
  template: '#item-template',
  props: {
    item: Object
  },
  data: function() {
    return {
      isOpen: false,
    };
  },
  //computed: {
  //  isFolder: function() {
  //    return this.item.children && this.item.children.length;
  //  }
  //},
  methods: {
    toggle: function() {
      console.log("toggle!", this.item);
      if (this.item.isInstance) {
          console.log("investigate", this.item.name);
      } else {
          // To get something working I had to make everything "isFolder == true"
        this.isOpen = !this.isOpen;
        this.$root.expandClass(this.item, false);
      }
    },
  }
})

app.mount('#demo')
