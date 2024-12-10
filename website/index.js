// 从 meta.ts 导入的艺术品数据
const meta = [
  {
    artist_link: 'https://www.google.com/search?q=Tom+Roberts',
    attribution: 'Art Gallery of New South Wales',
    attribution_link: 'partner/art-gallery-of-new-south-wales',
    creator: 'Tom Roberts',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_QgraSbQjk2t48JQ9f79WSbw7J0R4bWg0jZVvWJzfd1gSah4g_ieRfTaxsFzo-b8aWp9M8Gowg.webp',
    link: 'asset/vQEPldpJAUvS4Q',
    title: 'The camp, Sirius Cove',
    source: 'CI_TAB',
    width: 1920,
    height: 1419,
  },
  {
    artist_link: 'https://www.google.com/search?q=Nyapanyapa+Yunupingu',
    attribution: 'Art Gallery of New South Wales',
    attribution_link: 'partner/art-gallery-of-new-south-wales',
    creator: 'Nyapanyapa Yunupingu',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_TmDAwvYmEAs63-kgNvq-n2llaVhtZdDCT56ubOc7krYbeACdHpHWn94PMfKR9z_G87O9gUQA.webp',
    link: 'asset/xQGhkBUyBXAihw',
    title: 'Wild Apple Orchard',
    source: 'CI_TAB',
    width: 1920,
    height: 619,
  },
  {
    artist_link: 'https://www.google.com/search?q=Joseph+Mallord+William+Turner',
    attribution: 'Isabella Stewart Gardner Museum',
    attribution_link: 'partner/isabella-stewart-gardner-museum',
    creator: 'Joseph Mallord William Turner',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_SJD1guQN-sALAFjvCMs_p28WlCmbWg8cbckWumxy1VXyBlucHJdXLzcNXKG2Vggd15WLzXezc.webp',
    link: 'asset/WAHNt3hNg2Fz6A',
    title: 'The Roman Tower, Andernach',
    source: 'CI_TAB',
    width: 1920,
    height: 1207,
  },
  {
    artist_link: 'https://www.google.com/search?q=Paul+C%C3%A9zanne',
    attribution: 'Indianapolis Museum of Art at Newfields',
    attribution_link: 'partner/indianapolis-museum-of-art',
    creator: 'Paul Cézanne',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_SOomPViKjtyRqmNkz6q0TlNV9mlUZh4POOgN9RIONtdkdELdlPnetGiYLk4Ccepi7xuIeqqQ.webp',
    link: 'asset/HAEcLEiIhDAl-Q',
    title: 'House in Provence',
    source: 'CI_TAB',
    width: 1920,
    height: 1554,
  },
  {
    artist_link: 'https://www.google.com/search?q=Thomas+Moran',
    attribution: 'High Museum of Art ',
    attribution_link: 'partner/high-museum-of-art',
    creator: 'Thomas Moran',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_SrezWT3VeJqYh92axwkcM_lSVp4zaQDWtGAsYOs_Cty55G96q7psEgNBM_4Hl_e_NqL9dJ8sk.webp',
    link: 'asset/NwFEpOlPwvx9Yw',
    title: 'The Old Bridge Over Hook Pond, East Hampton, Long Island',
    source: 'CI_TAB',
    width: 1920,
    height: 1189,
  },
  {
    artist_link: 'https://artsandculture.google.com/entity/g122q4xx5',
    attribution: 'Pinacoteca de São Paulo',
    attribution_link: 'partner/pinacoteca-do-estado-de-sao-paulo',
    creator: 'Pedro Alexandrino',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_TMHxO4gUlwDbusqeSPU5kwpEfnsCkVZTzhA7sBuUFbxEKlOU-q3Y2LtgLqqiCzFcciKNZK05cn.webp',
    link: 'asset/swGuV_w9Zk_6HQ',
    title: 'Ostras e Cobres',
    source: 'CI_TAB',
    width: 1920,
    height: 1410,
  },
  {
    artist_link: 'https://www.google.com/search?q=Agust%C3%ADn+Salinas+y+Teruel',
    attribution: 'Pinacoteca de São Paulo',
    attribution_link: 'partner/pinacoteca-do-estado-de-sao-paulo',
    creator: 'Agustín Salinas y Teruel',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_QkFVubtO1StjQs0UraPdv9IHUqz0siamss6dIKIT33lIV1Z049hhEnxj-i5gPcDcqqFdCAVtck.webp',
    link: 'asset/JQEtl5x5-Dgi7Q',
    title: 'Festa Escolar no Ipiranga',
    source: 'CI_TAB',
    width: 1920,
    height: 1269,
  },
  {
    artist_link: 'https://www.google.com/search?q=Eug%C3%A8ne+Delacroix',
    attribution: 'The Museum of Fine Arts, Houston',
    attribution_link: 'partner/the-museum-of-fine-arts-houston',
    creator: 'Eugène Delacroix',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_TWkuAxt9NfBn72yp0lV0KDohNTmPHygxR3350xomyTLAcPib8mxM9JApR24y2aElrOoTriC7U.webp',
    link: 'asset/7QEvX2VgBvI66Q',
    title: 'Shipwreck on the Coast',
    source: 'CI_TAB',
    width: 1920,
    height: 1585,
  },
  {
    artist_link: 'https://www.google.com/search?q=Robert+William+Vonnoh',
    attribution: 'Indianapolis Museum of Art at Newfields',
    attribution_link: 'partner/indianapolis-museum-of-art',
    creator: 'Robert William Vonnoh',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_RhMEXMEmnqXblS38LasB9w6Fh3msEAP4RoNHhLyQfWm2HF1nktbln05GwQr012ElGb5SdZUw.webp',
    link: 'asset/-wH1uoTAMs2EsQ',
    title: 'Poppies',
    source: 'CI_TAB',
    width: 1920,
    height: 1392,
  },
  {
    artist_link: 'https://www.google.com/search?q=John+William+Hill',
    attribution: 'The Museum of Fine Arts, Houston',
    attribution_link: 'partner/the-museum-of-fine-arts-houston',
    creator: 'John William Hill',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_Q57_fCv9ZrWt1ZXHTB6Rev2TByRboSSJGo2ppDahSH7kdKgO0VXvSnjkDKtKiv0QZYP_IjG5DM.webp',
    link: 'asset/MQG1jz2aEOLV7Q',
    title: 'Woodland Pool with Men Fishing',
    source: 'CI_TAB',
    width: 1920,
    height: 1528,
  },
  {
    artist_link: 'https://www.google.com/search?q=Artist:+Utagawa+Toyoharu',
    attribution: "Smithsonian's National Museum of Asian Art",
    attribution_link: 'partner/natasianart',
    creator: 'Artist: Utagawa Toyoharu',
    image:
      'https://artab-files.owenyoung.com/file/artab-files/images/ci/AL18g_T5kOQFeZMXljWyR_8j0aqzavfdjQB70he3JV0JXiNA9srpFXEEguiLrvCj3m-F9Kk8w-XQv3o.webp',
    link: 'asset/7gFaoXT5gME8tA',
    title: 'A Winter Party',
    source: 'CI_TAB',
    width: 1920,
    height: 1085,
  },
];

document.addEventListener('alpine:init', () => {
  Alpine.data('artTab', () => ({
    currentIndex: 0,
    currentArt: null,
    loading: true,
    error: null,
    containerVisible: false,

    getCurrentDimensions() {
      if (this.currentArt) {
        return {
          width: this.currentArt.width,
          height: this.currentArt.height,
        };
      }
      const nextItem = meta[this.currentIndex];
      return {
        width: nextItem.width,
        height: nextItem.height,
      };
    },

    getBrowserType() {
      const ua = navigator.userAgent;
      if (ua.includes('Firefox')) {
        return 'firefox';
      } else if (ua.includes('Edg/')) {
        return 'edge';
      }
      return 'chrome';
    },

    getBrowserName() {
      const browserType = this.getBrowserType();
      return browserType.charAt(0).toUpperCase() + browserType.slice(1);
    },

    getBrowserIcon() {
      const browserType = this.getBrowserType();
      return `/static/${browserType}.png`;
    },

    getButtonText() {
      const browserType = this.getBrowserType();
      switch (browserType) {
        case 'firefox':
          return 'Add Artab to Firefox';
        case 'edge':
          return 'Add Artab to Edge';
        default:
          return 'Add Artab to Chrome';
      }
    },

    getStoreLink() {
      const browserType = this.getBrowserType();
      switch (browserType) {
        case 'firefox':
          return 'https://addons.mozilla.org/firefox/addon/your-addon-id';
        case 'edge':
          return 'https://microsoftedge.microsoft.com/addons/your-addon-id';
        default:
          return 'https://chrome.google.com/webstore/detail/your-addon-id';
      }
    },

    init() {
      this.loadInitialArtwork();

      // 添加键盘事件监听
      window.addEventListener('keydown', e => {
        if (this.loading) return;

        if (e.key === 'ArrowLeft') {
          this.previousArt();
        } else if (e.key === 'ArrowRight') {
          this.nextArt();
        }
      });

      // 添加鼠标移动效果
      window.addEventListener('mousemove', e => {
        const x = (e.clientX / window.innerWidth) * 100;
        const y = (e.clientY / window.innerHeight) * 100;
        document.documentElement.style.setProperty('--mouse-x', `${x}%`);
        document.documentElement.style.setProperty('--mouse-y', `${y}%`);
      });

      // 添加这段代码来设置art-info的宽度
      this.$nextTick(() => {
        const button = document.querySelector('.chrome-download-button');
        if (button) {
          const buttonWidth = button.offsetWidth;
          document.documentElement.style.setProperty('--button-width', buttonWidth + 'px');
        }
      });
    },

    async loadInitialArtwork() {
      try {
        this.error = null;

        // 随机选择一个起始索引
        this.currentIndex = Math.floor(Math.random() * meta.length);
        const item = meta[this.currentIndex];
        this.currentArt = {
          width: item.width,
          height: item.height,
        };

        this.containerVisible = true;

        await this.loadArtwork(this.currentIndex);
      } catch (error) {
        console.error('Failed to load initial artwork:', error);
        this.error = error.message || '加载失败';
      } finally {
        this.loading = false;
      }
    },

    async loadArtwork(index) {
      const item = meta[index];
      if (!item) return;

      this.loading = true;
      this.error = null;

      try {
        // 预加载图片
        await new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = item.image;
        });

        this.currentArt = {
          ...item,
          artist_link: this.composeLink(item.artist_link),
          attribution_link: this.composeLink(item.attribution_link),
          link: this.composeLink(item.link),
        };
      } catch (error) {
        console.error('Failed to load artwork:', error);
        this.error = '加载失败';
      } finally {
        this.loading = false;
      }
    },

    composeLink(link) {
      const baseUrl = 'https://artsandculture.google.com/';
      return link.startsWith('http') ? link : `${baseUrl}${link}`;
    },

    async previousArt() {
      if (this.loading) return;
      const prevIndex = (((this.currentIndex - 1) % meta.length) + meta.length) % meta.length;
      this.currentIndex = prevIndex;
      await this.loadArtwork(prevIndex);
    },

    async nextArt() {
      if (this.loading) return;
      const nextIndex = (this.currentIndex + 1) % meta.length;
      this.currentIndex = nextIndex;
      await this.loadArtwork(nextIndex);
    },

    handleImageLoad(e) {
      const img = e.target;
      console.log('Loaded image dimensions:', {
        width: img.offsetWidth,
        height: img.offsetHeight,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });
    },
  }));
});
