import FooterFlagLogo from './FooterFlagLogo';
import FooterLogo from './FooterLogo';
import FooterNavLinks from './FooterNavLinks';
import React from 'react';
import classNames from 'classnames';
import getMenu from '../../../../utils/menus';

const navigation = getMenu('footer');

const Footer = ({ className }: { className?: string }) => {
  return (
    <footer
      className={classNames('bg-white', className)}
      aria-labelledby="footer-heading"
    >
      <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <div className="flex flex-col space-y-5 xl:justify-between h-full">
              <FooterLogo />
              <div className="flex items-center">
                <FooterFlagLogo />
                <span className="ml-1">
                  <p className="text-sm text-gray-600 ">
                    ENGINEERED IN NACKA, SWEDEN.
                  </p>
                  <p className="text-sm text-gray-400 ">
                    Copyright 2022 DbVis Software AB
                  </p>
                </span>
              </div>
            </div>
          </div>
          <FooterNavLinks navigation={navigation} />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
