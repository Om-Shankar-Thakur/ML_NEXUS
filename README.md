# AI & Machine Learning Assessment

## Student Information

| Field | Details |
|-------|---------|
| **Full Name** | Om Shankar Thakur |
| **Email ID** | om.work466@gmail.com |
| **College Name** | Amity University |
| **Selected Skill Track** | AI & Machine Learning |

## Project Overview

This project demonstrates core AI & Machine Learning concepts through interactive implementations built with Python-equivalent algorithms running in a Node.js backend with a React frontend.

## Implemented Tasks

### 1. Linear Regression
- Implements Ordinary Least Squares (OLS) linear regression from scratch
- Computes slope, intercept, and R² (coefficient of determination)
- Visualizes data points and regression line on a scatter chart

### 2. K-Nearest Neighbors (KNN) Classification
- Implements KNN classifier from scratch using Euclidean distance
- Supports configurable K value
- Visualizes training points, query point, and nearest neighbors

### 3. K-Means Clustering
- Implements K-Means clustering algorithm from scratch
- Iteratively assigns points to clusters and updates centroids
- Visualizes clustered data with distinct colors per cluster

### 4. Descriptive Statistics
- Computes: Mean, Median, Mode, Standard Deviation, Variance, Min, Max
- Accepts any numerical dataset as input
- Displays results in a clear statistical summary

## Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Node.js + Express
- **Visualization**: Recharts
- **Algorithms**: Implemented from scratch (no external ML libraries)

## How to Run

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/ml-assessment run dev
```
