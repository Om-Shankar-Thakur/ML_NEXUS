import { useState, useMemo } from "react";
import { useRunKMeans } from "@/hooks/use-ml";
import { PageTransition } from "@/components/PageTransition";
import { Loader2, Play, AlertCircle } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Clustering() {
  const [inputData, setInputData] = useState("1.0, 1.0\n1.5, 2.0\n1.2, 1.5\n8.0, 8.0\n8.5, 9.0\n9.0, 8.5\n1.0, 8.0\n1.5, 8.5\n2.0, 8.0");
  const [k, setK] = useState("3");
  
  const { mutate, data, isPending, error } = useRunKMeans();

  const handleRun = () => {
    const points = inputData.split('\n')
      .map(line => {
        const [x, y] = line.split(',').map(s => Number(s.trim()));
        return { x, y };
      })
      .filter(p => !isNaN(p.x) && !isNaN(p.y));
    
    mutate({ 
      data: { 
        points,
        k: Number(k),
        maxIterations: 100
      } 
    });
  };

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#f59e0b', '#ec4899', '#3b82f6'];
  
  const clusterIds = useMemo(() => {
    if (!data) return [];
    return Array.from(new Set(data.clusters.map(c => c.cluster))).sort();
  }, [data]);

  return (
    <PageTransition className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">K-Means Clustering</h1>
        <p className="text-muted-foreground">Unsupervised learning algorithm to partition data into K distinct clusters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-md space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground uppercase tracking-wide">Data Points (X, Y)</label>
            <textarea
              className="w-full h-48 bg-background border-2 border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="1.0, 1.0&#10;8.0, 8.0"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Number of Clusters (K)</label>
            <input
              type="number"
              min="1"
              value={k}
              onChange={(e) => setK(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            onClick={handleRun}
            disabled={isPending}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            Run K-Means
          </button>
          
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-4 flex gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Clustering failed. Ensure you have enough points for K clusters.</p>
            </div>
          )}
        </div>

        {/* Results Visualization */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-md flex-1 min-h-[400px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                Cluster Assignments
              </h3>
              {data && (
                <span className="text-sm px-3 py-1 bg-muted text-muted-foreground rounded-full">
                  Converged in {data.iterations} iterations
                </span>
              )}
            </div>
            
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                  <XAxis type="number" dataKey="x" name="X" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis type="number" dataKey="y" name="Y" stroke="hsl(var(--muted-foreground))" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }} 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  
                  {!data && (
                    <Scatter 
                      name="Unclustered Data" 
                      data={inputData.split('\n').map(l => { const [x,y]=l.split(','); return {x:Number(x), y:Number(y)} }).filter(p=>!isNaN(p.x))} 
                      fill="hsl(var(--muted-foreground))" 
                    />
                  )}

                  {data && clusterIds.map((cId, i) => (
                    <Scatter 
                      key={cId} 
                      name={`Cluster ${cId}`} 
                      data={data.clusters.filter(c => c.cluster === cId)} 
                      fill={COLORS[i % COLORS.length]} 
                    />
                  ))}
                  
                  {data && (
                    <Scatter 
                      name="Centroids" 
                      data={data.centroids} 
                      fill="hsl(var(--foreground))" 
                      shape="cross" 
                    />
                  )}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
