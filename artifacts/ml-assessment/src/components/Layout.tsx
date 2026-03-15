import { useState } from "react";
import { Link, useRoute } from "wouter";
import { BrainCircuit, LineChart, Network, BarChart3, Calculator, Menu, X } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Overview", icon: BrainCircuit },
    { href: "/regression", label: "Linear Regression", icon: LineChart },
    { href: "/classification", label: "KNN Classification", icon: Network },
    { href: "/clustering", label: "K-Means Clustering", icon: BarChart3 },
    { href: "/statistics", label: "Statistics", icon: Calculator },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Mobile Nav */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card relative z-50">
        <div className="flex items-center gap-2 font-display font-bold text-xl text-primary">
          <BrainCircuit className="w-6 h-6" />
          <span>ML Nexus</span>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 pt-16 md:pt-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="hidden md:flex items-center gap-2 p-6 font-display font-bold text-2xl text-primary border-b border-border/50">
          <BrainCircuit className="w-8 h-8" />
          <span>ML Nexus</span>
        </div>
        
        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const [isActive] = useRoute(link.href);
            const Icon = link.icon;
            return (
              <Link 
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary font-semibold shadow-sm border border-primary/20' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-background relative min-h-[calc(100vh-64px)] md:min-h-screen">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
        <div className="relative z-10 p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </main>
      
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
