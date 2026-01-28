const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [botStatus, setBotStatus] = useState<BotStatus>(BotStatus.STOPPED);
  const [features, setFeatures] = useState<BotFeature[]>(INITIAL_FEATURES);

  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Restore login from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem("auth");
    if (savedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Authentication Guard
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login');
    } else if (isAuthenticated && location.pathname === '/login') {
      navigate('/');
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Stop bot on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setBotStatus(BotStatus.STOPPED);
    }
  }, [isAuthenticated]);

  const handleLogin = (method: 'facebook' | 'cookie') => {
    localStorage.setItem("auth", "true"); // ✅ IMPORTANT
    setIsAuthenticated(true);
    setBotStatus(BotStatus.RUNNING);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth"); // ✅ IMPORTANT
    setIsAuthenticated(false);
    setBotStatus(BotStatus.STOPPED);
    navigate('/login');
  };

  const toggleFeature = (id: string) => {
    setFeatures(prev =>
      prev.map(f => f.id === id ? { ...f, enabled: !f.enabled } : f)
    );
  };

  const toggleBotMaster = () => {
    setBotStatus(prev =>
      prev === BotStatus.RUNNING ? BotStatus.STOPPED : BotStatus.RUNNING
    );
  };

  if (!isAuthenticated && location.pathname === '/login') {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      <Sidebar onLogout={handleLogout} />

      <main className="flex-1 ml-64 p-10">
        <Routes>
          <Route path="/" element={<DashboardHome status={botStatus} toggleBot={toggleBotMaster} />} />
          <Route path="/control" element={<ControlPage status={botStatus} onStatusChange={setBotStatus} />} />
          <Route path="/features" element={<FeatureToggles features={features} onToggle={toggleFeature} />} />
          <Route path="/logs" element={<LogsPage />} />
          <Route path="/groups" element={<GroupControlPage />} />
          <Route path="/apis" element={<ApiManagementPage />} />
        </Routes>
      </main>
    </div>
  );
};
