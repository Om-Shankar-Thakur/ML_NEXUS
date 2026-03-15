import { PageTransition } from "@/components/PageTransition";
import { User, Mail, School, BookOpen, ChevronRight, LayoutDashboard } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const tasks = [
    { name: "Linear Regression", path: "/regression", desc: "Predict continuous values using simple OLS" },
    { name: "KNN Classification", path: "/classification", desc: "Categorize points based on nearest neighbors" },
    { name: "K-Means Clustering", path: "/clustering", desc: "Group unlabelled data into distinct clusters" },
    { name: "Descriptive Statistics", path: "/statistics", desc: "Compute mean, median, variance, and more" },
  ];

  return (
    <PageTransition className="max-w-5xl mx-auto space-y-10">
      <div className="space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">Welcome to ML Nexus</h1>
        <p className="text-lg text-muted-foreground">Interactive Machine Learning Assessment Environment</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/20 transition-colors duration-500" />
        
        <h2 className="text-2xl font-display font-semibold mb-8 flex items-center gap-3">
          <User className="w-7 h-7 text-primary" />
          Candidate Profile
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
          <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Full Name</p>
              <p className="text-lg font-medium text-foreground">Om Shankar Thakur</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Email</p>
              <p className="text-lg font-medium text-foreground">om.work466@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <School className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">College</p>
              <p className="text-lg font-medium text-foreground">Amity University</p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-background/50 p-4 rounded-xl border border-border/50">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Skill Track</p>
              <p className="text-lg font-medium text-foreground">AI & Machine Learning</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-display font-semibold flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-primary" />
          Explore Algorithms
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tasks.map((task) => (
            <Link 
              key={task.path} 
              href={task.path}
              className="group bg-card border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 block"
            >
              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                {task.name}
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </h4>
              <p className="text-sm text-muted-foreground mt-2">{task.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
