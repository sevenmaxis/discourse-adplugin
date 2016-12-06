import { registerUnbound } from 'discourse-common/lib/helpers';

export function insert_hood(index) {
  return Discourse.SiteSettings[`dfp_hood_${index}_display`] === true;
}

registerUnbound('insert_hood', insert_hood);
