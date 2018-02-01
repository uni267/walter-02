import analyze from "./analyze";
import initElasticsearch from "./initElasticsearch";
import moveInvisibleFiles from "./moveInvisibleFiles";

export const AnalyzeTask = () => analyze();

export const initElasticsearchTask = () => initElasticsearch();

export const moveInvisibleFilesTask = () => moveInvisibleFiles();
