import analyze from "./analyze";
import initElasticsearch from "./initElasticsearch";

export const AnalyzeTask = () => analyze();

export const initElasticsearchTask = () => initElasticsearch();
