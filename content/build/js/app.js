// Global-ish variables for the mapping portion of the app

'use strict';

const DrawerAppGlobal = {
  apiUrl: window.location.href.includes('localhost:') ? 'localAPI' : 'prodAPI',
  map: null,
  geocoder: null,
  baseLocation: {
    lat: 37.09024,
    lng: -95.712891
  },
  currentUser: document.getElementById('txUsr') == null ? null : document.getElementById('txUsr').value,
  colors: {
    COMPATIBLE: '5c821a',
    NONCOMPATIBLE: 'eb8a44',
    VERTEBRATE: '4c474a',
    INVERTEBRATE: '75b1a9',
    BELT: '8f61aa',
    CELL: 'ddabed'
  },
  mapDataMarkers: [],
  mapDataPolys: [],
  workMarkers: [],
  workPolys: [],
  hasHardware: false
};
const DrawerApp = (() => {
  const els = {
    body: document.getElementsByTagName('body')[0],
    map: document.getElementById('map'),
    mapFilters: document.getElementById('map-filters'),
    filterHandle: document.getElementById('filter-handle'),
    toolTips: document.querySelectorAll('[data-bs-toggle="tooltip"]'),
    drawer: document.getElementById('drawer'),
    drawerContainer: document.getElementById('drawer-container'),
    drawerNav: document.getElementById('drawer-nav'),
    drawerNavLinks: document.querySelectorAll('.js-drawerNavLink'),
    addPhotoLinks: document.querySelectorAll('.js-drawerPhotoLink'),
    cancelPhotoBtns: document.querySelectorAll('.js-cancelPhotoBtn'),
    filterHandleIcons: document.querySelectorAll('.js-filterHandleIcon'),
    drawerHandleOpenClose: document.getElementById('drawer-openclose'),
    drawerHandleMaxMin: document.getElementById('drawer-maxmin'),
    legendOpenCloseBtns: document.querySelectorAll('.js-shrinkTrigger')
  };

  //Icons get rewritten on load with SVGs. Have to do the lookups w/i the Fn.
  const iconEls = {
    filterHandleIcons: '.js-filterHandleIcon',
    drawerHandleDirectionIcons: '.js-drawerHandleDirectionIcon',
    drawerHandleMaxMinIcons: '.js-drawerHandleMaxMinIcon'
  };
  const utils = {
    getEnvironment: () => {
      const url = window.location.href;
      return url.includes('localhost:') ? 'DEV' : 'PROD';
    },
    googleErrorMessage: () => {
      console.log('DrawerApp googleErrorMessage: This would be an error message.');
    }
  };
  /**
   * 
   * @param {*} thing 
   */
  const setBaseMap = thing => {
    map = new google.maps.Map(els.map, {
      center: {
        lat: 41.159501,
        lng: -81.440390
      },
      zoom: 10
    });
    window.gm_authFailure = function () {
      // remove the map div or maybe call another API to load map
      // maybe display a useful message to the user
      DrawerApp.utils.googleErrorMessage();
    };
  };
  const setTooltips = () => {
    const tooltipTriggerList = els.toolTips;
    [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
  };
  const setFilterHandle = () => {
    els.mapFilters.classList.toggle('d-none');
    document.querySelectorAll(iconEls.filterHandleIcons).forEach(icon => {
      icon.classList.toggle('d-none');
    });
  };
  const setDrawerHandleOpenClose = () => {
    els.drawerContainer.classList.toggle('-is-closed');
    els.drawerNav.classList.toggle('-is-closed');
    document.querySelectorAll(iconEls.drawerHandleDirectionIcons).forEach(icon => {
      icon.classList.toggle('d-none');
    });
    if (els.drawerContainer.classList.contains('-is-closed')) {
      els.body.classList.remove('-is-max');
    }
  };
  const setDrawerHandleMaxMin = () => {
    els.body.classList.toggle('-is-max');
    els.drawerContainer.classList.toggle('-is-max');
    els.drawerContainer.classList.remove('-is-closed');
    document.querySelectorAll(iconEls.drawerHandleMaxMinIcons).forEach(icon => {
      icon.classList.toggle('d-none');
    });
  };
  const setDrawerNavLinks = () => {
    function scrollToLoc(e) {
      e.preventDefault();
      const locTarget = this.dataset.loc;
      const loc = document.getElementById(locTarget);
      loc.scrollIntoView();
    }
    ;
    els.drawerNavLinks.forEach(link => {
      link.addEventListener('click', scrollToLoc, false);
    });
  };
  const setAddPhotoLinks = () => {
    function setVisibility(e) {
      e.preventDefault();
      const locTarget = this.dataset.targetid;
      document.getElementById(locTarget).classList.remove('d-none');
    }
    ;
    els.addPhotoLinks.forEach(link => {
      link.addEventListener('click', setVisibility, false);
    });
  };
  const setCancelPhotoBtns = () => {
    function resetForm(e) {
      e.preventDefault();
      const locTarget = this.dataset.targetid;
      const form = document.getElementById(locTarget);
      form.reset();
      form.classList.add('d-none');
    }
    ;
    els.cancelPhotoBtns.forEach(link => {
      link.addEventListener('click', resetForm, true);
    });
  };
  const setLegendViews = evt => {
    const targetContent = document.getElementById(evt.currentTarget.dataset.targ);
    const targetIcons = `#${evt.currentTarget.id} .js-openCloseIcon`;
    const icons = document.querySelectorAll(`${targetIcons}`);
    targetContent.classList.toggle('d-none');
    icons.forEach((icon, i) => {
      icon.classList.toggle('d-none');
    });
  };
  const setEventHandlers = () => {
    setTooltips();
    setDrawerNavLinks();
    setAddPhotoLinks();
    setCancelPhotoBtns();
    els.filterHandle.addEventListener('click', setFilterHandle, false);
    els.drawerHandleOpenClose.addEventListener('click', setDrawerHandleOpenClose, false);
    els.drawerHandleMaxMin.addEventListener('click', setDrawerHandleMaxMin, false);
    els.legendOpenCloseBtns.forEach(btn => {
      btn.addEventListener('click', setLegendViews, false);
    });
  };
  const init = () => {
    DrawerApp.env = DrawerApp.utils.getEnvironment();
    setEventHandlers();
    //setBaseMap();
  };

  return {
    init,
    utils,
    els
  };
})();