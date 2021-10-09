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
        });
        //.then(() => self.populateClasses());
  },
  methods: {
    //populateClasses: function() {
    //    var binding = null;
    //    for (binding of store.query(rootClassQuery)) {
    //        console.log(binding);
    //        this.addClass(this.treeData, binding.get("class").value);
    //    }
    //},
    addItem: function(item) {
        console.log(item);
    },
    addClass: function(item, text, instances) {
      let parts = text.split(/[\/#]/);
      console.log(parts);
      item.children.push({
          name: text,
          disp: parts[parts.length-1],
          count: instances.length,
          children: [],
          isInstance: false,
      });
    },
    addInstance: function(item, instance) {
      item.children.push({
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
        this.expandClass(this.item);
      }
    },
    expandClass: function(item) {
        console.log("expand", item);
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
            console.log(uri);
        }
        let foundAny = false;
        for (const [uri, instances] of Object.entries(counts)) {
            foundAny = true;
            console.log(uri, instances.length);
            this.$root.addClass(item, uri, instances);
        }

        if (!foundAny) {
            this.addInstances(item);
        }

        // if only one child was expanded, continue expanding the tree
        if (item.children?.length == 1) {
            console.log(item.children[0]);
            this.expandClass(item.children[0]);
        }

    },
    addInstances: function(item) {
        var query = `
        PREFIX brick: <https://brickschema.org/schema/Brick#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>        
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?item WHERE { 
            ?item rdf:type <${item.name}>
        }`
        for (let binding of store.query(query)) {
            this.$root.addInstance(item, binding.get("item").value);
        }
    },
  }
})

app.mount('#demo')
