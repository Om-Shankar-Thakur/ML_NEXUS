import { Router, type IRouter } from "express";

const router: IRouter = Router();

function linearRegression(points: Array<{ x: number; y: number }>) {
  const n = points.length;
  const sumX = points.reduce((s, p) => s + p.x, 0);
  const sumY = points.reduce((s, p) => s + p.y, 0);
  const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
  const sumX2 = points.reduce((s, p) => s + p.x * p.x, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const yMean = sumY / n;
  const ssTot = points.reduce((s, p) => s + Math.pow(p.y - yMean, 2), 0);
  const ssRes = points.reduce((s, p) => s + Math.pow(p.y - (slope * p.x + intercept), 2), 0);
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  const xMin = Math.min(...points.map((p) => p.x));
  const xMax = Math.max(...points.map((p) => p.x));
  const predictions = [
    { x: xMin, y: slope * xMin + intercept },
    { x: xMax, y: slope * xMax + intercept },
  ];

  return { slope, intercept, rSquared, predictions };
}

function euclideanDistance(a: { x: number; y: number }, b: { x: number; y: number }) {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

function knnClassify(
  trainingPoints: Array<{ x: number; y: number; label: string }>,
  queryPoint: { x: number; y: number },
  k: number
) {
  const withDistances = trainingPoints.map((p) => ({
    ...p,
    distance: euclideanDistance(p, queryPoint),
  }));
  withDistances.sort((a, b) => a.distance - b.distance);
  const neighbors = withDistances.slice(0, k);

  const labelCounts: Record<string, number> = {};
  for (const n of neighbors) {
    labelCounts[n.label] = (labelCounts[n.label] || 0) + 1;
  }
  const predictedLabel = Object.entries(labelCounts).sort((a, b) => b[1] - a[1])[0][0];

  return { predictedLabel, neighbors };
}

function computeStatistics(data: number[]) {
  const sorted = [...data].sort((a, b) => a - b);
  const n = data.length;
  const mean = data.reduce((s, v) => s + v, 0) / n;
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

  const freq: Record<number, number> = {};
  for (const v of data) freq[v] = (freq[v] || 0) + 1;
  const maxFreq = Math.max(...Object.values(freq));
  const modeEntries = Object.entries(freq).filter(([, f]) => f === maxFreq);
  const mode = maxFreq > 1 ? Number(modeEntries[0][0]) : null;

  const variance = data.reduce((s, v) => s + Math.pow(v - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  const min = sorted[0];
  const max = sorted[n - 1];

  return { mean, median, mode, stdDev, variance, min, max, count: n };
}

function kMeans(points: Array<{ x: number; y: number }>, k: number, maxIterations = 100) {
  let centroids = points.slice(0, k).map((p, i) => ({ x: p.x, y: p.y, cluster: i }));

  let assignments: number[] = new Array(points.length).fill(0);
  let iterations = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    iterations++;
    const newAssignments = points.map((p) => {
      let minDist = Infinity;
      let cluster = 0;
      for (let ci = 0; ci < k; ci++) {
        const dist = euclideanDistance(p, centroids[ci]);
        if (dist < minDist) {
          minDist = dist;
          cluster = ci;
        }
      }
      return cluster;
    });

    const changed = newAssignments.some((a, i) => a !== assignments[i]);
    assignments = newAssignments;

    if (!changed) break;

    const newCentroids = Array.from({ length: k }, (_, ci) => {
      const clusterPoints = points.filter((_, pi) => assignments[pi] === ci);
      if (clusterPoints.length === 0) return centroids[ci];
      const cx = clusterPoints.reduce((s, p) => s + p.x, 0) / clusterPoints.length;
      const cy = clusterPoints.reduce((s, p) => s + p.y, 0) / clusterPoints.length;
      return { x: cx, y: cy, cluster: ci };
    });
    centroids = newCentroids;
  }

  const clusters = points.map((p, i) => ({ x: p.x, y: p.y, cluster: assignments[i] }));
  return { clusters, centroids, iterations };
}

router.post("/linear-regression", (req, res) => {
  const { points } = req.body as { points: Array<{ x: number; y: number }> };
  if (!points || points.length < 2) {
    res.status(400).json({ error: "At least 2 points required" });
    return;
  }
  const result = linearRegression(points);
  res.json(result);
});

router.post("/classify", (req, res) => {
  const { trainingPoints, queryPoint, k } = req.body as {
    trainingPoints: Array<{ x: number; y: number; label: string }>;
    queryPoint: { x: number; y: number };
    k: number;
  };
  if (!trainingPoints || trainingPoints.length < 1 || !queryPoint) {
    res.status(400).json({ error: "Training points and query point required" });
    return;
  }
  const result = knnClassify(trainingPoints, queryPoint, k || 3);
  res.json(result);
});

router.post("/statistics", (req, res) => {
  const { data } = req.body as { data: number[] };
  if (!data || data.length < 1) {
    res.status(400).json({ error: "At least 1 data point required" });
    return;
  }
  const result = computeStatistics(data);
  res.json(result);
});

router.post("/kmeans", (req, res) => {
  const { points, k, maxIterations } = req.body as {
    points: Array<{ x: number; y: number }>;
    k: number;
    maxIterations?: number;
  };
  if (!points || points.length < k) {
    res.status(400).json({ error: "Need at least k data points" });
    return;
  }
  const result = kMeans(points, k, maxIterations || 100);
  res.json(result);
});

export default router;
