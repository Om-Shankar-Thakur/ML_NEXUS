import { useState } from "react";
import { useRunLinearRegression } from "@/hooks/use-ml";
import { PageTransition } from "@/components/PageTransition";
import { formatNumber } from "@/lib/utils";
import { Loader2, Play, AlertCircle } from "lucide-react";
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function LinearRegression() {
  const [inputData, setInputData] = useState("1.0, 2.1\n2.0, 3.8\n3.0, 5.2\n4.0, 6.9\n5.0, 8.5\n6.0, 10.1\n7.0, 12.0");
  const { mutate, data, isPending, error } = useRunLinearRegression();

  const handleRun = () => {
    const points = inputData.split('\n')
      .map(line => {
        const [x, y] = line.split(',').map(s => Number(s.trim()));
        return { x, y };
      })
      .filter(p => !isNaN(p.x) && !isNaN(p.y));
    
    mutate({ data: { points } });
  };

  const scatterData = inputData.split('\n')
    .map(line => {
      const [x, y] = line.split(',').map(s => Number(s.trim()));
      return { x, y };
    })
    .filter(p => !isNaN(p.x) && !isNaN(p.y));

  const sortedLineData = data?.predictions ? [...data.predictions].sort((a, b) => a.x - b.x) : [];

  return (
    <PageTransition className="max-w-6xl mx-auto space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Linear Regression</h1>
        <p className="text-muted-foreground">Fit a simple Ordinary Least Squares (OLS) line through a set of 2D points.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Inputs */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-md space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground uppercase tracking-wide">Data Points (X, Y)</label>
            <textarea
              className="w-full h-48 bg-background border-2 border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder="1, 2&#10;2, 4&#10;3, 5"
            />
            <p className="text-xs text-muted-foreground">Enter one point per line, comma separated.</p>
          </div>

          <button
            onClick={handleRun}
            disabled={isPending || scatterData.length < 2}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            Fit Model
          </button>

          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-4 flex gap-3 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>Failed to run regression. Check input format.</p>
            </div>
          )}
        </div>

        {/* Right Column: Visualization & Results */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-md">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-foreground">
              Regression Plot
            </h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart margin={{ top: 10, right: 10, bottom: 20, left: 0 }}>
                  <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="4 4" vertical={false} />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="X" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Y" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3', stroke: 'hsl(var(--muted-foreground))' }} 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  <Scatter name="Actual Data" data={scatterData} fill="hsl(var(--primary))" />
                  {data && (
                    <Line 
                      name="Regression Line" 
                      data={sortedLineData} 
                      dataKey="y" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3} 
                      dot={false} 
                      activeDot={false} 
                    />
                  )}
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {data && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <p className="text-sm text-muted-foreground mb-1">Slope (m)</p>
                <p className="text-2xl font-bold font-mono text-foreground">{formatNumber(data.slope)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <p className="text-sm text-muted-foreground mb-1">Intercept (c)</p>
                <p className="text-2xl font-bold font-mono text-foreground">{formatNumber(data.intercept)}</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
                <p className="text-sm text-muted-foreground mb-1">R-Squared (R²)</p>
                <p className="text-2xl font-bold font-mono text-primary">{formatNumber(data.rSquared)}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
