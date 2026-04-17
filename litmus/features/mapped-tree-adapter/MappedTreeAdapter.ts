import { DataAdapter } from "cx/ui";
import { ReadOnlyDataView } from "cx/data";
import type { View } from "cx/data";
import type { RenderingContext } from "cx/ui";
import type { Instance } from "cx/ui";

/**
 * Fixed display node structure produced by onMapRecord.
 * Each source record maps to exactly one display node (without children).
 * Children are loaded on demand when the node is expanded.
 */
export interface MappedTreeNode {
   id: string | number;
   text: string;
   isLeaf?: boolean;
   expanded?: boolean; // default/initial expansion state
   data?: any; // source record reference
   extra?: any; // arbitrary metadata
}

export interface MappedTreeNodeInfo extends MappedTreeNode {
   $level: number;
   $loading: boolean;
   $loaded: boolean;
   expanded: boolean;
   isLeaf: boolean;
}

/**
 * Per-node state maintained inside the adapter.
 * Tracks expanded/loading/loaded status, cached children, and a version for cache invalidation.
 */
interface NodeState {
   expanded: boolean;
   loading: boolean;
   loaded: boolean;
   version: number;
   childRecords?: any[]; // loaded child source records
}

interface NodeStateMap {
   [nodeId: string]: NodeState;
}

interface CacheEntry {
   version: number;
   node: MappedTreeNode;
}

interface MappedTreeCache {
   mapCache: WeakMap<object, CacheEntry>;
   viewCache: Map<string, MappedTreeNodeView>;
}

interface MappedTreeInstance extends Instance {
   mappedTreeCache?: MappedTreeCache;
   state?: {
      nodeState?: NodeStateMap;
      [key: string]: any;
   };
}

interface MappedTreeNodeViewConfig {
   store: View;
   adapter: MappedTreeAdapter;
   instance: MappedTreeInstance;
   recordAlias: string;
   indexAlias: string;
   immutable?: boolean;
   sealed?: boolean;
}

/**
 * Custom View for mapped tree node records.
 * Intercepts writes to $record.expanded and routes to the adapter.
 */
class MappedTreeNodeView extends ReadOnlyDataView {
   declare adapter: MappedTreeAdapter;
   declare instance: MappedTreeInstance;
   declare recordAlias: string;
   declare indexAlias: string;

   constructor(config: MappedTreeNodeViewConfig) {
      super(config);
   }

   setItem(path: string, value: any): boolean {
      if (path === this.recordAlias || path.startsWith(this.recordAlias + ".")) {
         return this.handleRecordWrite(path, value);
      }
      if (this.store) return this.store.setItem(path, value);
      return false;
   }

   deleteItem(path: string): boolean {
      if (path === this.recordAlias || path.startsWith(this.recordAlias + ".")) {
         return false;
      }
      if (this.store) return this.store.deleteItem(path);
      return false;
   }

   handleRecordWrite(path: string, value: any): boolean {
      let record = this.data[this.recordAlias] as MappedTreeNodeInfo;
      let nodeId = record.id;

      if (path === this.recordAlias) {
         if (value.expanded !== record.expanded) {
            this.adapter.toggleExpanded(this.instance, nodeId, value.expanded);
         } else if (this.adapter.onNodeChange) {
            this.adapter.onNodeChange(value, this.instance);
         }
         return true;
      }

      let field = path.substring(this.recordAlias.length + 1);

      if (field === "expanded") {
         this.adapter.toggleExpanded(this.instance, nodeId, value);
         return true;
      }

      if (this.adapter.onNodeChange) {
         let updated = { ...record, [field]: value };
         this.adapter.onNodeChange(updated, this.instance);
      }
      return true;
   }

   setMappedTreeNodeInfo(displayData: MappedTreeNodeInfo, index: number): void {
      this.setData({
         [this.recordAlias]: displayData,
         [this.indexAlias]: index,
      });
   }
}

MappedTreeNodeView.prototype.recordAlias = "$record";
MappedTreeNodeView.prototype.indexAlias = "$index";

export interface MappedTreeAdapterConfig {
   /** Maps a single source record to a display node (without children). */
   onMapRecord: (sourceRecord: any) => MappedTreeNode;

   /** Loader called when a node is expanded and children aren't loaded yet. Can return child source records directly or a Promise. */
   onLoadChildRecords?: (node: MappedTreeNode) => any[] | Promise<any[]>;

   /** Called when a display node field changes (other than expanded). The node contains the updated values and node.data references the source record. */
   onNodeChange?: (node: MappedTreeNodeInfo, instance: Instance) => void;

   /** Record alias used in data bindings. Default: "$record" */
   recordName?: string;

   /** Index alias used in data bindings. Default: "$index" */
   indexName?: string;

   /** If true, record data is treated as immutable. */
   immutable?: boolean;

   /** If true, record data is sealed (copied before augmenting). */
   sealed?: boolean;
}

/**
 * MappedTreeAdapter - lazy, iterative tree adapter.
 *
 * Maps source records to display nodes one at a time via `onMapRecord`.
 * Children are loaded on demand via `onLoadChildRecords` when a node is expanded.
 * Node state (expanded, loading, loaded, children, version) is stored in
 * grid instance.state, so changes trigger shouldUpdate and prepareData.
 * A WeakMap caches onMapRecord results keyed by (sourceRecord, version).
 */
export class MappedTreeAdapter extends DataAdapter {
   declare onMapRecord: (sourceRecord: any) => MappedTreeNode;
   declare onLoadChildRecords?: (node: MappedTreeNode) => any[] | Promise<any[]>;
   declare onNodeChange?: (node: MappedTreeNodeInfo, instance: Instance) => void;
   declare isTreeAdapter: boolean;

   constructor(config: MappedTreeAdapterConfig) {
      super(config);
      this.recordName = this.recordName || "$record";
      this.indexName = this.indexName || "$index";
   }

   initInstance(context: RenderingContext, instance: MappedTreeInstance): void {
      if (!instance.mappedTreeCache) {
         instance.mappedTreeCache = {
            mapCache: new WeakMap(),
            viewCache: new Map(),
         };
      }
   }

   getNodeState(instance: MappedTreeInstance, nodeId: string | number): NodeState {
      let nodeState = instance.state?.nodeState;
      if (nodeState?.[nodeId]) return nodeState[nodeId];
      return { expanded: false, loading: false, loaded: false, version: 0 };
   }

   setNodeState(instance: MappedTreeInstance, nodeId: string | number, state: NodeState): void {
      instance.setState({
         nodeState: {
            ...instance.state?.nodeState,
            [nodeId]: state,
         },
      });
   }

   /**
    * Map a single source record to a display node, using cache.
    * Cache is invalidated when the source record changes (WeakMap miss)
    * or when the node's version changes.
    */
   mapAndCache(
      instance: MappedTreeInstance,
      sourceRecord: any,
      mapCache: WeakMap<object, CacheEntry>,
   ): { node: MappedTreeNode; state: NodeState } {
      let cached = mapCache.get(sourceRecord);
      let state = cached && this.getNodeState(instance, cached.node.id);
      if (cached && cached.version === state!.version) return { node: cached.node, state: state! };
      let node = this.onMapRecord(sourceRecord);
      if (!state || node.id !== cached!.node.id) state = this.getNodeState(instance, node.id);
      mapCache.set(sourceRecord, { version: state.version, node });
      return { node, state };
   }

   getRecords(context: RenderingContext, instance: MappedTreeInstance, records: any[], parentStore: View): any[] {
      if (!instance.mappedTreeCache) {
         this.initInstance(context, instance);
      }

      let { mapCache, viewCache } = instance.mappedTreeCache!;
      let result: any[] = [];

      if (Array.isArray(records)) {
         this.processLevel(instance, records, 0, "", result, mapCache, viewCache, parentStore);
      }

      return result;
   }

   /**
    * Recursively process a level of source records.
    * Each record is mapped to a display node. If the node is expanded
    * and has loaded children, those children are processed recursively.
    */
   processLevel(
      instance: MappedTreeInstance,
      sourceRecords: any[],
      level: number,
      parentKey: string,
      result: any[],
      mapCache: WeakMap<object, CacheEntry>,
      viewCache: Map<string, MappedTreeNodeView>,
      parentStore: View,
   ): void {
      for (let i = 0; i < sourceRecords.length; i++) {
         let sourceRecord = sourceRecords[i];
         let { node, state } = this.mapAndCache(instance, sourceRecord, mapCache);
         let key = parentKey ? `${parentKey}:${node.id}` : String(node.id);
         let isLeaf = node.isLeaf ?? false;

         // Use node.expanded as default only if this node has no state yet
         let hasState = !!instance.state?.nodeState?.[node.id];
         let expanded = isLeaf ? false : hasState ? state.expanded : (node.expanded ?? false);

         let displayData: MappedTreeNodeInfo = {
            id: node.id,
            text: node.text,
            isLeaf,
            expanded,
            $level: level,
            $loading: state.loading,
            $loaded: state.loaded,
            data: node.data,
            extra: node.extra,
         };

         // Get or create view
         let view = viewCache.get(key);
         if (!view) {
            view = new MappedTreeNodeView({
               store: parentStore,
               immutable: this.immutable,
               sealed: this.sealed,
               adapter: this,
               instance,
               recordAlias: this.recordName,
               indexAlias: this.indexName,
            });
            viewCache.set(key, view);
         } else {
            view.setStore(parentStore);
            view.instance = instance;
         }
         view.setMappedTreeNodeInfo(displayData, result.length);

         result.push({
            data: displayData,
            key,
            store: view,
            type: "data" as const,
            index: result.length,
         });

         // If expanded, process loaded children
         if (!isLeaf && expanded) {
            if (state.childRecords) {
               this.processLevel(
                  instance,
                  state.childRecords,
                  level + 1,
                  key,
                  result,
                  mapCache,
                  viewCache,
                  parentStore,
               );
            } else if (!state.loaded && !state.loading && this.onLoadChildRecords) {
               let loadResult = this.onLoadChildRecords(node);
               if (Array.isArray(loadResult)) {
                  // Sync - store children and process immediately in this render pass
                  state = { ...state, expanded, childRecords: loadResult, loaded: true, version: state.version + 1 };
                  this.setNodeState(instance, node.id, state);
                  this.processLevel(instance, loadResult, level + 1, key, result, mapCache, viewCache, parentStore);
               } else {
                  // Async - set loading and wait
                  this.setNodeState(instance, node.id, { ...state, expanded, loading: true });
                  loadResult.then((children) => {
                     let current = this.getNodeState(instance, node.id);
                     this.setNodeState(instance, node.id, {
                        ...current,
                        childRecords: children,
                        loaded: true,
                        loading: false,
                        version: current.version + 1,
                     });
                  });
               }
            }
         }
      }
   }

   /**
    * Called when the user toggles a node's expanded state.
    */
   toggleExpanded(instance: MappedTreeInstance, nodeId: string | number, expanded: boolean): void {
      let state = this.getNodeState(instance, nodeId);
      this.setNodeState(instance, nodeId, { ...state, expanded });
   }

   sort(): void {}
}

MappedTreeAdapter.prototype.recordName = "$record";
MappedTreeAdapter.prototype.indexName = "$index";
MappedTreeAdapter.prototype.immutable = false;
MappedTreeAdapter.prototype.sealed = false;
MappedTreeAdapter.prototype.isTreeAdapter = true;
MappedTreeAdapter.autoInit = true;
