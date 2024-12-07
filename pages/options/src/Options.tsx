import '@src/Options.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { updateFrequencyStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import packageJson from '../../../package.json';

const Options = () => {
  const updateFrequency = useStorage(updateFrequencyStorage);

  return (
    <div className="options-container">
      <div className="options-content">
        <h2 className="options-title">{t('changeArtWork')}</h2>
        <div className="radio-group">
          <label className="radio-item">
            <input
              type="radio"
              name="frequency"
              value="every_tab"
              checked={updateFrequency === 'every_tab'}
              onChange={e => updateFrequencyStorage.set(e.target.value as any)}
            />
            <span>{t('everyNewTab')}</span>
          </label>

          <label className="radio-item">
            <input
              type="radio"
              name="frequency"
              value="every_10min"
              checked={updateFrequency === 'every_10min'}
              onChange={e => updateFrequencyStorage.set(e.target.value as any)}
            />
            <span>{t('every10Min')}</span>
          </label>

          <label className="radio-item">
            <input
              type="radio"
              name="frequency"
              value="every_hour"
              checked={updateFrequency === 'every_hour'}
              onChange={e => updateFrequencyStorage.set(e.target.value as any)}
            />
            <span>{t('everyHour')}</span>
          </label>
          <label className="radio-item">
            <input
              type="radio"
              name="frequency"
              value="every_day"
              checked={updateFrequency === 'every_day'}
              onChange={e => updateFrequencyStorage.set(e.target.value as any)}
            />
            <span>{t('daily')}</span>
          </label>
        </div>

        <div className="footer">
          <div className="author">
            <a href="https://www.owenyoung.com" target="_blank" rel="noopener noreferrer">
              Made by Owen
            </a>
          </div>
          <div className="links">
            <a href="https://github.com/username/repo/issues" target="_blank" rel="noopener noreferrer">
              {t('feedback')}
            </a>
            <span className="divider">·</span>
            <a href="https://github.com/username/repo" target="_blank" rel="noopener noreferrer">
              {t('sourceCode')}
            </a>
          </div>
          <div className="version">{t('version', packageJson.version)}</div>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>{t('loading')}</div>), <div>{t('error')}</div>);
