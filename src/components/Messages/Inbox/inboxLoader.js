import ContentLoader from 'react-content-loader';
import React from 'react';

export const InboxLoader = () => (
    <ContentLoader height={70} width={300} speed={2} primaryColor="#f3f3f3" secondaryColor="#dddbdb">
      <rect x="69" y="12" rx="4" ry="4" width="117" height="8" />
      <rect x="69" y="28" rx="3" ry="3" width="210" height="8" />
      <rect x="230" y="11" rx="3" ry="3" width="8" height="8" />
      <rect x="245" y="11" rx="3" ry="3" width="8" height="8" />
      <rect x="260" y="11" rx="3" ry="3" width="20" height="8" />
      <circle cx="38" cy="25" r="20" />
    </ContentLoader>
);
