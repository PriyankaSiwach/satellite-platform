export type DataSource = "simulation" | "real";

let currentSource: DataSource = "simulation";

export function getDataSource() {
  return currentSource;
}

export function setDataSource(source: DataSource) {
  currentSource = source;
}