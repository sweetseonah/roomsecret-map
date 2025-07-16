import React from 'react';

export interface SectionProps {
  title: string;
  desc: string | null;
  contents: React.JSX.Element;
  util: React.JSX.Element | null;
}
