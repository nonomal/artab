import '@src/Options.css';
import { useStorage, withErrorBoundary, withSuspense } from '@extension/shared';
import { updateFrequencyStorage } from '@extension/storage';
import { t } from '@extension/i18n';

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
      </div>
    </div>
  );
};

export default withErrorBoundary(withSuspense(Options, <div>{t('loading')}</div>), <div>{t('error')}</div>);
