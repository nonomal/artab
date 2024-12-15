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
          <div className="feedback-section">
            <a href="https://t.me/+KisLFTUscGVkNjNh" target="_blank" rel="noopener noreferrer">
              {t('feedback')}
            </a>
            <span className="version">{t('version', packageJson.version)}</span>
          </div>

          <div className="credits">
            <div className="made-by">
              Made by{' '}
              <a href="https://www.owenyoung.com" target="_blank" rel="noopener noreferrer">
                Owen
              </a>{' '}
              &{' '}
              <a href="https://mazzzystar.github.io/" target="_blank" rel="noopener noreferrer">
                Mazzystar
              </a>
              {', with '}
              <span>🐕 Tokki & Cookie (Chief Happiness Officers)</span>
            </div>
            <div className="inspired-by">
              Inspired by{' '}
              <a
                href="https://apps.apple.com/us/app/arts-word-famous-paintings/id6739025807"
                target="_blank"
                rel="noopener noreferrer">
                Arts
              </a>
              {' & '}
              <a
                href="https://chromewebstore.google.com/detail/google-arts-culture/akimgimeeoiognljlfchpbkpfbmeapkh"
                target="_blank"
                rel="noopener noreferrer">
                Google Arts & Culture
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>{t('loading')}</div>), <div>{t('error')}</div>);
