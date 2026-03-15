import { useState, useMemo } from "react";
import { useRunClassification } from "@/hooks/use-ml";
import { PageTransition } from "@/components/PageTransition";
import { formatNumber } from "@/lib/utils";
import { Loader2, Play, AlertCircle, Crosshair } from "lucide-react";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function Classification() {
  const [trainData, setTrainData] = useState("1, 2, A\n2, 3, A\n3, 1, B\n4, 4, B\n1.5, 1.5, A\n3.5, 4.5, B\n2.5, 1.5, A\n4.5, 3.5, B");
  const [qx, setQx] = useState("3");
  const [qy, setQy] = useState("2.5");
  const [k, setK] = useState("3");
  
  const { mutate, data, isPending, error } = useRunClassification();

  const parsedTraining = useMemo(() => {
    return trainData.split('\n')
      .map(line => {
        const parts = line.split(',');
        if(parts.length < 3) return null;
        return { 
          x: Number(parts[0].trim()), 
          y: Number(parts[1].trim()), 
          label: parts[2].trim() 
        };
      })
      .filter(p => p !== null && !isNaN(p.x) && !isNaN(p.y)) as {x: number, y: number, label: string}[];
  }, [trainData]);

  const handleRun = () => {
    mutate({
      data: {
        trainingPoints: parsedTraining,
        queryPoint: { x: Number(qx), y: Number(qy) },
        k: Number(k)
      }
    });
  };

  const groups = Array.from(new Set(parsedTraining.map(p => p.label)));
  const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', '#f59e0b', '#ec4899'];

  return (
    <PageTransition className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">K-Nearest Neighbors</h1>
        <p className="text-muted-foreground">Classify a query point based on the majority label of its K nearest neighbors.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Settings Panel */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-md space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground uppercase tracking-wide">Training Data (X, Y, Label)</label>
            <textarea
              className="w-full h-32 bg-background border-2 border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
              value={trainData}
              onChange={(e) => setTrainData(e.target.value)}
              placeholder="1, 2, ClassA"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Query X</label>
              <input
                type="number"
                value={qx}
                onChange={(e) => setQx(e.target.value)}
                className="w-full bg-background border-2 border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Query Y</label>
              <input
                type="number"
                value={qy}
                onChange={(e) => setQy(e.target.value)}
                className="w-full bg-background border-2 border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">K Neighbors</label>
            <input
              type="number"
              min="1"
              max={parsedTraining.length}
              value={k}
              onChange={(e) => setK(e.target.value)}
              className="w-full bg-background border-2 border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          <button
            onClick={handleRun}
            disabled={isPending || parsedTraining.length === 0}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            Classify Point
          </button>
          
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-4 flex gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Classification failed. Check inputs.</p>
            </div>
          )}
        </div>

        {/* Visualization & Results */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {data && (
            <div className="bg-card border border-primary/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(20,184,166,0.1)] flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Predicted Label</p>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-primary" />
                  <span className="text-4xl font-display font-bold text-foreground">{data.predictedLabel}</span>
                </div>
              </div>
              <Crosshair className="w-12 h-12 text-primary/20" />
            </div>
          )}

          <div className="bg-card border border-border rounded-2xl p-6 shadow-md flex-1">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-foreground">
              Feature Space
            </h3>
            <div className="h-[350px] w-full">
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
                  
                  {groups.map((g, i) => (
                    <Scatter 
                      key={g} 
                      name={`Class ${g}`} 
                      data={parsedTraining.filter(p => p.label === g)} 
                      fill={COLORS[i % COLORS.length]} 
                    />
                  ))}
                  
                  <Scatter 
                    name="Query Point" 
                    data={[{x: Number(qx), y: Number(qy)}]} 
                    fill="hsl(var(--foreground))" 
                    shape="star" 
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {data && (
             <div className="bg-card border border-border rounded-xl p-6 shadow-sm overflow-hidden">
             <h3 className="font-semibold text-foreground mb-4">Nearest Neighbors (K={data.neighbors.length})</h3>
             <div className="overflow-x-auto">
               <table className="w-full text-left text-sm">
                 <thead>
                   <tr className="border-b border-border text-muted-foreground">
                     <th className="pb-3 font-medium">X</th>
                     <th className="pb-3 font-medium">Y</th>
                     <th className="pb-3 font-medium">Label</th>
                     <th className="pb-3 font-medium text-right">Distance</th>
                   </tr>
                 </thead>
                 <tbody>
                   {data.neighbors.map((n, i) => (
                     <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/50 transition-colors">
                       <td className="py-3 font-mono">{formatNumber(n.x)}</td>
                       <td className="py-3 font-mono">{formatNumber(n.y)}</td>
                       <td className="py-3">
                         <span className="px-2.5 py-1 rounded-md bg-muted text-foreground font-medium text-xs">
                           {n.label}
                         </span>
                       </td>
                       <td className="py-3 text-right font-mono text-muted-foreground">
                         {formatNumber(n.distance)}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
