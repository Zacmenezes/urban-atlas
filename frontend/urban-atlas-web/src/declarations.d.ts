import 'leaflet';

declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'leaflet' {
  interface MarkerClusterGroupOptions extends LayerOptions {
    showCoverageOnHover?: boolean;
  }

  interface MarkerClusterGroup extends FeatureGroup {
    clearLayers(): this;
    addLayer(layer: Layer): this;
    addLayers(layers: Layer[]): this;
  }

  function markerClusterGroup(options?: MarkerClusterGroupOptions): MarkerClusterGroup;
}

declare module 'leaflet.markercluster';

