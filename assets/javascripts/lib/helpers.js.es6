/*jshint esversion: 6 */

export function registerHelper(name, fn) {
  Ember.HTMLBars._registerHelper(name, fn);
}
