import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const internshipPlaces = [
    t("footer.places.newYork"),
    t("footer.places.losAngeles"),
    t("footer.places.chicago"),
    t("footer.places.sanFrancisco"),
    t("footer.places.miami"),
    t("footer.places.seattle"),
  ];

  const internshipStreams = [
    t("footer.streams.webDevelopment"),
    t("footer.streams.appDevelopment"),
    t("footer.streams.javaDevelopment"),
    t("footer.streams.pythonDevelopment"),
    t("footer.streams.dataScience"),
    t("footer.streams.uiuxDesign"),
  ];

  const jobPlaces = [
    t("footer.places.mumbai"),
    t("footer.places.pune"),
    t("footer.places.bangalore"),
    t("footer.places.hyderabad"),
    t("footer.places.delhi"),
    t("footer.places.chennai"),
  ];

  const jobStreams = [
    t("footer.streams.softwareDevelopment"),
    t("footer.streams.marketing"),
    t("footer.streams.finance"),
    t("footer.streams.humanResources"),
    t("footer.streams.sales"),
    t("footer.streams.management"),
  ];

  const aboutLinks = [
    t("footer.links.aboutUs"),
    t("footer.links.contactUs"),
  ];

  const teamLinks = [
    t("footer.links.ourTeam"),
    t("footer.links.careers"),
  ];

  const termsLinks = [
    t("footer.links.termsConditions"),
    t("footer.links.privacyPolicy"),
  ];

  const sitemapLinks = [
    t("footer.links.home"),
    t("footer.links.internships"),
    t("footer.links.jobs"),
  ];

  return (
    <footer className="w-full bg-gray-900 text-white">

      {/* Footer Container */}
      <div className="w-full px-8 sm:px-12 lg:px-20 xl:px-28 py-16">

        {/* Main Sections */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-x-16
            gap-y-14
            w-full
          "
        >

          {/* Internships by Places */}
          <FooterSection
            title={t("footer.internshipsByPlaces")}
            items={internshipPlaces}
          />

          {/* Internships by Stream */}
          <FooterSection
            title={t("footer.internshipsByStream")}
            items={internshipStreams}
          />

          {/* Jobs by Places */}
          <FooterSection
            title={t("footer.jobsByPlaces")}
            items={jobPlaces}
          />

          {/* Jobs by Stream */}
          <FooterSection
            title={t("footer.jobsByStream")}
            items={jobStreams}
          />

        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-700 my-14"></div>

        {/* Secondary Sections */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            md:grid-cols-3
            lg:grid-cols-4
            gap-x-16
            gap-y-12
            w-full
          "
        >

          {/* About */}
          <FooterSection
            title={t("footer.about")}
            items={aboutLinks}
          />

          {/* Our Team */}
          <FooterSection
            title={t("footer.ourTeam")}
            items={teamLinks}
          />

          {/* Legal */}
          <FooterSection
            title={t("footer.legal")}
            items={termsLinks}
          />

          {/* Quick Links */}
          <FooterSection
            title={t("footer.quickLinks")}
            items={sitemapLinks}
          />

        </div>

        {/* Divider */}
        <div className="w-full border-t border-gray-700 my-12"></div>

        {/* Bottom Section */}
        <div
          className="
            w-full
            flex
            flex-col
            md:flex-row
            items-center
            justify-between
            gap-8
          "
        >

          {/* Google Play */}
          <div
            className="
              flex
              items-center
              gap-3
              border
              border-gray-600
              rounded-lg
              px-6
              py-3
              cursor-pointer
              hover:bg-gray-800
              hover:border-gray-400
              transition
            "
          >

            <span className="text-xl">
              ▶
            </span>

            <div>

              <p className="text-xs text-gray-400">
                {t("footer.availableOn")}
              </p>

              <p className="text-sm font-semibold">
                Google Play
              </p>

            </div>

          </div>

          {/* Social Media */}
          <div className="flex items-center gap-5">

            <SocialIcon>
              <FaFacebookF />
            </SocialIcon>

            <SocialIcon>
              <FaTwitter />
            </SocialIcon>

            <SocialIcon>
              <FaInstagram />
            </SocialIcon>

          </div>

          {/* Copyright */}
          <p className="text-sm text-gray-400 text-center">
            {t("footer.copyright")}
          </p>

        </div>

      </div>

    </footer>
  );
}


// Footer Section

function FooterSection({ title, items }) {
  return (
    <div className="w-full">

      <h3
        className="
          text-base
          font-bold
          text-white
          mb-6
        "
      >
        {title}
      </h3>

      <div className="flex flex-col gap-4">

        {items.map((item, index) => (
          <a
            key={index}
            href="/"
            className="
              text-sm
              text-gray-400
              hover:text-white
              hover:translate-x-1
              transition-all
              duration-200
              w-fit
            "
          >
            {item}
          </a>
        ))}

      </div>

    </div>
  );
}


// Social Icon

function SocialIcon({ children }) {
  return (
    <div
      className="
        w-11
        h-11
        rounded-full
        border
        border-gray-600
        flex
        items-center
        justify-center
        text-gray-400
        cursor-pointer
        hover:bg-blue-600
        hover:text-white
        hover:border-blue-600
        transition-all
        duration-300
      "
    >
      {children}
    </div>
  );
}

