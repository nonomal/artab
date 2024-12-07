import '@src/Options.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { exampleThemeStorage, updateFrequencyStorage } from '@extension/storage';
import { Button } from '@extension/ui';

const Options = () => {
  const theme = useStorage(exampleThemeStorage);
  const updateFrequency = useStorage(updateFrequencyStorage);
  const isLight = theme === 'light';
  const logo = isLight ? 'options/logo_horizontal.svg' : 'options/logo_horizontal_dark.svg';

  const goGithubSite = () =>
    chrome.tabs.create({ url: 'https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite' });

  return (
    <div className={`App ${isLight ? 'bg-slate-50 text-gray-900' : 'bg-gray-800 text-gray-100'}`}>
      <button onClick={goGithubSite}>
        <img src={chrome.runtime.getURL(logo)} className="App-logo" alt="logo" />
      </button>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">更新频率设置</h2>
        <select
          value={updateFrequency}
          onChange={e => updateFrequencyStorage.set(e.target.value as any)}
          className={`p-2 rounded ${isLight ? 'bg-white' : 'bg-gray-700'}`}>
          <option value="every_tab">每个新标签页都更新</option>
          <option value="every_10min">每10分钟更新一次</option>
          <option value="every_hour">每小时更新一次</option>
          <option value="every_day">每天更新一次</option>
        </select>
      </div>

      <Button className="mt-4" onClick={exampleThemeStorage.toggle} theme={theme}>
        Toggle theme
      </Button>

      <div className="mt-8 border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">关于</h3>
        <p className="mb-2">作者: Your Name</p>
        <div className="flex gap-4">
          <a
            href="https://github.com/yourusername/your-repo/issues"
            target="_blank"
            className="text-blue-500 hover:text-blue-600">
            问题反馈
          </a>
          <a href="mailto:your-email@example.com" className="text-blue-500 hover:text-blue-600">
            联系作者
          </a>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div> Loading ... </div>), <div> Error Occur </div>);
