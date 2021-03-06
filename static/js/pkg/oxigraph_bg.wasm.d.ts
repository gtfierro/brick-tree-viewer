/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function __wbg_memorystore_free(a: number): void;
export function memorystore_new(a: number, b: number): number;
export function memorystore_dataFactory(a: number): number;
export function memorystore_add(a: number, b: number): void;
export function memorystore_delete(a: number, b: number): void;
export function memorystore_has(a: number, b: number): number;
export function memorystore_size(a: number): number;
export function memorystore_match(a: number, b: number, c: number, d: number, e: number, f: number): void;
export function memorystore_query(a: number, b: number, c: number): number;
export function memorystore_update(a: number, b: number, c: number): void;
export function memorystore_load(a: number, b: number, c: number, d: number, e: number, f: number, g: number): void;
export function memorystore_dump(a: number, b: number, c: number, d: number, e: number): void;
export function __wbg_datafactory_free(a: number): void;
export function datafactory_namedNode(a: number, b: number, c: number): number;
export function datafactory_blankNode(a: number, b: number, c: number): number;
export function datafactory_literal(a: number, b: number, c: number, d: number): number;
export function datafactory_defaultGraph(a: number): number;
export function datafactory_triple(a: number, b: number, c: number, d: number): number;
export function datafactory_quad(a: number, b: number, c: number, d: number, e: number): number;
export function datafactory_fromTerm(a: number, b: number): number;
export function datafactory_fromQuad(a: number, b: number): number;
export function __wbg_namednode_free(a: number): void;
export function namednode_term_type(a: number, b: number): void;
export function namednode_value(a: number, b: number): void;
export function namednode_equals(a: number, b: number): number;
export function __wbg_blanknode_free(a: number): void;
export function blanknode_term_type(a: number, b: number): void;
export function blanknode_value(a: number, b: number): void;
export function blanknode_equals(a: number, b: number): number;
export function __wbg_literal_free(a: number): void;
export function literal_term_type(a: number, b: number): void;
export function literal_value(a: number, b: number): void;
export function literal_language(a: number, b: number): void;
export function literal_datatype(a: number): number;
export function literal_equals(a: number, b: number): number;
export function __wbg_defaultgraph_free(a: number): void;
export function defaultgraph_term_type(a: number, b: number): void;
export function defaultgraph_value(a: number, b: number): void;
export function defaultgraph_equals(a: number, b: number): number;
export function __wbg_quad_free(a: number): void;
export function quad_subject(a: number): number;
export function quad_predicate(a: number): number;
export function quad_object(a: number): number;
export function quad_graph(a: number): number;
export function quad_equals(a: number, b: number): number;
export function __wbindgen_malloc(a: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number): number;
export function __wbindgen_free(a: number, b: number): void;
export function __wbindgen_exn_store(a: number): void;
export function __wbindgen_add_to_stack_pointer(a: number): number;
