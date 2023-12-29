import { createRoot } from 'react-dom/client'
import App from './App';
const container = document.getElementById('root');

// 创建root
const root = createRoot(container);

//通过root渲染App
root.render(<App />);