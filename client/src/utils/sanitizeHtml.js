const SCRIPT_TAG_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER_ATTR_REGEX = /\son\w+="[^"]*"/gi;
const JS_PROTOCOL_REGEX = /javascript:/gi;

export const sanitizeHtml = (html) => {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return html
    .replace(SCRIPT_TAG_REGEX, '')
    .replace(EVENT_HANDLER_ATTR_REGEX, '')
    .replace(JS_PROTOCOL_REGEX, '');
};

