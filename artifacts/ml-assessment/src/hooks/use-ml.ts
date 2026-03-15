// Re-exporting hooks from the workspace api-client to maintain consistent imports
import { 
  useRunLinearRegression, 
  useRunClassification, 
  useComputeStatistics, 
  useRunKMeans 
} from "@workspace/api-client-react";

export {
  useRunLinearRegression,
  useRunClassification,
  useComputeStatistics,
  useRunKMeans
};
