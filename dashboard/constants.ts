
import { BotFeature, User } from './types';

export const API_BASE = "https://shourov-bot-control.onrender.com";

export const OWNER_INFO: User = {
  id: 'shourov-01',
  name: 'Alihsan Shourov',
  profilePic: 'https://files.catbox.moe/mc5fa5.jpg', // Placeholder, user should replace
  coverVideo: 'https://files.catbox.moe/4zg8rq.mp4',
};

export const REPO_URL = 'https://github.com/MOHAMMAD-SHOUROV/SHOUROV-BOTSM.git';

export const SOCIAL_LINKS = {
  facebook: 'https://facebook.com/AlihsanShourov',
  whatsapp: 'https://wa.me/8801709281334',
  gmail: 'mailto:shourovislam5430@gmail.com'
};

export const INITIAL_FEATURES: BotFeature[] = [
  { id: 'autotime', name: 'Auto Time', enabled: true, description: 'Automatically update bot timing' },
  { id: 'admin', name: 'Admin Only', enabled: false, description: 'Restrict bot to admins only' },
  { id: 'video', name: 'Video Downloader', enabled: true, description: 'Enable FB/Insta video downloads' },
  { id: 'caption', name: 'Auto Caption', enabled: true, description: 'Generate captions for media' },
];

export const MOCK_GROUPS = [
  { id: 'g1', name: 'Official Shourov Fans', active: true, memberCount: 1540 },
  { id: 'g2', name: 'Bot Testing Community', active: false, memberCount: 890 },
  { id: 'g3', name: 'Shourov Dev Group', active: true, memberCount: 12400 },
  { id: 'g4', name: 'Messenger Automation', active: true, memberCount: 540 },
];

export const MOCK_APIS = [
  { id: 'api-1', name: 'FB Graph v20.0', key: 'EAAGm...', status: 'active' },
  { id: 'api-2', name: 'OpenAI GPT-4o', key: 'sk-...', status: 'active' },
  { id: 'api-3', name: 'Weather Stack', key: '550e...', status: 'inactive' },
  { id: 'api-4', name: 'Shourov Custom API', key: 'sh-99...', status: 'active' },
];
