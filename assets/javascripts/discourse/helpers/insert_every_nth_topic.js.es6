import { registerUnbound } from 'discourse-common/lib/helpers';

export function insert_every_nth_topic(index) {
  if (!Discourse.SiteSettings.dfp_nth_topics_display) return false;
  
  var nth = Discourse.SiteSettings.dfp_nth_topic_position;

  if (nth === 0) return false;
  if (index === 0) return false;

  return (index % nth) === 0 ? true : false;
}

registerUnbound('insert_every_nth_topic', insert_every_nth_topic);
