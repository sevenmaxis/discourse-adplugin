# name: discourse-adplugin
# about: Ad Plugin for Discourse
# version: 1.0.2
# authors: Vi and Sarah (@ladydanger and @cyberkoi)

register_css <<CSS

div#top-1 {

}

li.top-2 {
  display: inline-flex;
  margin-top: -9px;
  margin-right: 12px;
}

div#top-2 {
  width: 300px;
  height: 60px;
}

@media screen and (max-width: 750px) {
  li.top-2 {
    visibility: hidden;
    display: none;
  }
}

tr.hood {
}

td#hood {
  padding: 0 !important;
}

div#premium-1 {
  width: 1110px;
  height: 200px;
}

#topic-bottom {
  width: 1100px;
  height: 200px;
}

.timeline-container {
  .topic-timeline {
    margin-left: 0em;
    float: left;
    width: 75px;
  }
  div#right-panel {
    float: left;
    width: 200px;
  }
}

.google-dfp-ad {
  padding: 3px 0;
  margin-bottom: 10px;
  clear: both;
}

.google-dfp-ad  .dfp-ad-unit {
  margin: 0 auto;
}

.google-adsense {
  padding: 3px 0;
  margin-bottom: 10px;
  clear: both;
}

.google-adsense  .adsense-unit {
  margin: 0 auto;
}

.amazon-product-links {
  padding: 3px;
  margin-bottom: 10px;
  clear: both;
}

.amazon-product-links  .amazon-unit {
  margin: 0 auto;
}

.amazon-product-links .amazon-product-links-label {
  width: 728px;
  margin: 0 auto;
}

.amazon-product-links .amazon-product-links-label h2 {
  margin: 4px 0 !important;
  color: #858a8c;
  text-transform: uppercase;
  font-size: 12px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: normal;
}

.google-adsense .google-adsense-label {
  width: 728px;
  margin: 0 auto;
}

.google-adsense .google-adsense-label h2 {
  margin: 4px 0 !important;
  color: #858a8c;
  text-transform: uppercase;
  font-size: 12px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: normal;
}

.google-adsense .google-adsense-content {
  margin: 0 auto;
}

.google-dfp-ad .google-dfp-ad-label {
  width: 728px;
  margin: 0 auto;
}

.google-dfp-ad .google-dfp-ad-label h2 {
  margin: 4px 0 !important;
  color: #858a8c;
  text-transform: uppercase;
  font-size: 12px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  font-weight: normal;
}

.google-dfp-ad.dfp-ad-post-bottom {
  .google-dfp-ad-label, .dfp-ad-unit {
    margin: 0 0 0 52px;
  }
}

CSS
