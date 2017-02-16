'use strict';

const EventEmitter = require('events').EventEmitter;

const setCookiePattern = /^(\w+)=(.*?)(;(.*?))?$/;
const settingsPattern = /(\w+)=(.*?)(;|$)/g;

class Mockdock extends EventEmitter {

  constructor(data) {
    super();
    this.eventListeners = {};
    this._cookie = '';
    this.selector = data && data.selector;
    this.attributes = data && data.attributes || {};
    this.children = (data && data.children) ? data.children : [];
    this.setCookies = {};
    this.create = [];
    this.style = {};
    this.readyState = 'complete';
  }

  get cookie() {
    return this._cookie;
  }

  set cookie(value) {
    const parsedCookie = parseSetCookie.call(this, value);
    if (!parsedCookie.cookie) throw new Error(`Not a valid cookie: ${value}`);

    this._cookie += parsedCookie.cookie;
  }

  addEventListener(type, fn) {
    if (!this.eventListeners[type]) {
      this.eventListeners[type] = [];
    }

    this.eventListeners[type].push(fn);
  }

  triggerEventListener(type) {
    if (!this.eventListeners[type]) return;

    this.eventListeners[type].forEach((fn) => {
      fn();
    });
  }

  createElement(type) {
    const document = new Mockdock();
    if (type) {
      document.localName = type.toLowerCase();
    }

    if (type === 'video') {
      document.canPlayType = () => {
        return '';
      };
    }
    this.children.push(document);

    document.on('setAttribute', (value) => {
      this.emit('setAttribute', value);
    });

    document.on('removeAttribute', (value) => {
      this.emit('removeAttribute', value);
    });

    return document;
  }

  getElementsByTagName(tag) {
    return this.children.filter((c) => c.localName === tag.toLowerCase());
  }

  removeAttribute(attrName) {
    if (attrName === 'id') {
      delete this.id;
    }

    delete this.attributes[attrName];
    this.emit('removeAttribute', attrName, this);
  }

  setAttribute(cmd, value) {
    this.attributes[cmd] = value;
    this.emit('setAttribute', value, this);
  }

  hasAttribute(attrName) {
    return this.attributes[attrName];
  }

  domContentLoaded() {
    this.emit('DOMContentLoaded');
  }

  getElementById(id) {
    return this.children.find((elm) => elm.id === id);
  }

  querySelector(selectors) {
    return this.children.find((child) => {
      return child.selector === selectors;
    });
  }

  querySelectorAll() {
    return this.children;
  }

  getAttribute(name) {
    return this.attributes && this.attributes[name];
  }

  appendChild(element) {
    this.children.push(element);
    this.emit('appendChild', element);
    return element;
  }
}

function parseSetCookie(cookie) {
  const parsed = {};
  if (!/;$/.test(cookie)) cookie = `${cookie};`;

  cookie.trim().replace(setCookiePattern, (match, name, value, settings) => {
    parsed.cookie = `${name}=${value};`;
    parsed.name = name;
    parsed.value = decodeURIComponent(value);
    Object.assign(parsed, parseSettings(settings));
  });

  if (parsed.name) {
    this.setCookies[parsed.name] = parsed;
  }

  return parsed;
}

function parseSettings(settings) {
  const parsed = {};

  settings.replace(settingsPattern, (match, name, value) => {
    if (name === 'expires') value = new Date(value);
    parsed[name] = value;
  });

  return parsed;
}

module.exports = Mockdock;
