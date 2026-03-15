import { useState } from "react";
import { useComputeStatistics } from "@/hooks/use-ml";
import { PageTransition } from "@/components/PageTransition";
import { formatNumber } from "@/lib/utils";
import { Loader2, Play, AlertCircle, Sigma, Divide, Hash, TrendingUp, TrendingDown, Maximize2, Minimize2, BarChart2 } from "lucide-react";

export default function Statistics() {
  const [dataStr, setDataStr] = useState("12, 15, 15, 18, 22, 25, 25, 25, 30, 40, 52, 52");
  const { mutate, data, isPending, error } = useComputeStatistics();

  const handleCompute = () => {
    const arr = dataStr.split(',')
      .map(s => Number(s.trim()))
      .filter(n => !isNaN(n));
      
    mutate({ data: { data: arr } });
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }: any) => (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex justify-between items-start mb-4">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
        <div className={`p-2 rounded-lg ${colorClass} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
        </div>
      </div>
      <h3 className="text-3xl font-display font-bold text-foreground">
        {value}
      </h3>
    </div>
  );

  return (
    <PageTransition className="max-w-5xl mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-display font-bold text-foreground">Descriptive Statistics</h1>
        <p className="text-muted-foreground">Compute core statistical properties for a numerical dataset.</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 shadow-md">
        <label className="text-sm font-semibold text-foreground uppercase tracking-wide block mb-3">Dataset (Comma Separated)</label>
        <textarea
          className="w-full h-24 bg-background border-2 border-border rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-none mb-4"
          value={dataStr}
          onChange={(e) => setDataStr(e.target.value)}
          placeholder="1, 2, 3, 4.5, 5"
        />
        
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Values are parsed automatically. Invalid tokens are ignored.</p>
          <button
            onClick={handleCompute}
            disabled={isPending}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-8 rounded-xl flex items-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-4 h-4" />}
            Compute Stats
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-xl p-4 flex gap-3 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>Computation failed. Please ensure you have provided valid numerical data.</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold border-b border-border pb-2">Results</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Mean" value={formatNumber(data.mean)} icon={Divide} colorClass="bg-blue-500 text-blue-500" />
            <StatCard title="Median" value={formatNumber(data.median)} icon={BarChart2} colorClass="bg-emerald-500 text-emerald-500" />
            <StatCard title="Mode" value={data.mode === null ? 'None' : formatNumber(data.mode)} icon={Hash} colorClass="bg-amber-500 text-amber-500" />
            <StatCard title="Count" value={data.count} icon={Sigma} colorClass="bg-purple-500 text-purple-500" />
            
            <StatCard title="Std Deviation" value={formatNumber(data.stdDev)} icon={TrendingUp} colorClass="bg-rose-500 text-rose-500" />
            <StatCard title="Variance" value={formatNumber(data.variance)} icon={TrendingDown} colorClass="bg-indigo-500 text-indigo-500" />
            <StatCard title="Maximum" value={formatNumber(data.max)} icon={Maximize2} colorClass="bg-cyan-500 text-cyan-500" />
            <StatCard title="Minimum" value={formatNumber(data.min)} icon={Minimize2} colorClass="bg-orange-500 text-orange-500" />
          </div>
        </div>
      )}
    </PageTransition>
  );
}
