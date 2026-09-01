import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "framer-motion";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ExternalLink,
  AtSign,
  Globe,
  Mail,
  MapPin,
  Menu,
  Search,
  X,
} from "lucide-react";
import { assets, businesses, Business, Category, filters, gallery } from "./data";

const navItems = [
  { label: "Explore", href: "#explore" },
  { label: "Dining", href: "#dining" },
  { label: "Wellness", href: "#wellness" },
  { label: "Events", href: "#events" },
  { label: "Visit", href: "#visit" },
];

const categoryLinks = [
  { label: "Eat & Drink", href: "#dining" },
  { label: "Health & Wellness", href: "#wellness" },
  { label: "Shop", href: "#explore", filter: "Retail" as Category },
  { label: "Gather", href: "#events" },
];

const easeOut = [0.22, 1, 0.36, 1] as const;

const sectionReveal: Variants = {
  hidden: { opacity: 0, y: 42 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easeOut },
  },
};

const directoryReveal: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.26, ease: easeOut },
  },
};

const imageFrameReveal: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease: easeOut },
  },
};

const imageInnerReveal: Variants = {
  hidden: { scale: 1.035 },
  visible: {
    scale: 1,
    transition: { duration: 1.05, ease: easeOut },
  },
};

const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -72 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.82, ease: easeOut },
  },
};

const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 72 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.82, ease: easeOut },
  },
};

const staggerReveal: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.025, delayChildren: 0.02 },
  },
};

const cardReveal: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.99 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.24, ease: easeOut },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.99,
    transition: { duration: 0.14, ease: "easeOut" },
  },
};

const getTargetTop = (target: HTMLElement) => {
  const headerOffset =
    Number.parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--header-height"),
    ) || 0;
  const categoryOffset =
    target.id && target.id !== "top"
      ? (document.querySelector<HTMLElement>(".category-strip")?.getBoundingClientRect().height ?? 0) + 42
      : 0;

  return Math.max(
    0,
    target.getBoundingClientRect().top + window.scrollY - headerOffset - categoryOffset,
  );
};

const animatePageScroll = (targetTop: number) => {
  const startTop = window.scrollY;
  const distance = targetTop - startTop;
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;

  if (Math.abs(distance) < 2) {
    window.scrollTo(0, targetTop);
    window.dispatchEvent(new Event("scroll"));
    return;
  }

  root.style.scrollBehavior = "auto";
  const duration = Math.min(620, Math.max(360, Math.abs(distance) * 0.28));
  const startTime = window.performance.now();

  const tick = (time: number) => {
    const progress = Math.min(1, (time - startTime) / duration);
    const eased = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, startTop + distance * eased);

    if (progress < 1) {
      window.requestAnimationFrame(tick);
    } else {
      window.scrollTo(0, targetTop);
      root.style.scrollBehavior = previousScrollBehavior;
      window.dispatchEvent(new Event("scroll"));
    }
  };

  window.requestAnimationFrame(tick);
};

function App() {
  const shouldReduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [wideViewport, setWideViewport] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(min-width: 861px)").matches,
  );
  const [activeFilter, setActiveFilter] = useState<"All" | Category>("All");
  const [query, setQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [activeWellness, setActiveWellness] = useState("inner-sight");
  const [activeGallery, setActiveGallery] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const mobileMenuButton = useRef<HTMLButtonElement | null>(null);

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const resetScroll = () => window.scrollTo(0, 0);
    resetScroll();
    window.addEventListener("load", resetScroll, { once: true });
    return () => window.removeEventListener("load", resetScroll);
  }, []);

  const revealProps = shouldReduceMotion
    ? {}
    : {
        variants: sectionReveal,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.18 },
      };

  const directoryRevealProps = shouldReduceMotion
    ? {}
    : {
        variants: directoryReveal,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.08 },
      };

  const imageRevealProps = shouldReduceMotion
    ? {}
    : {
        variants: imageFrameReveal,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.24 },
      };

  const slideLeftProps = shouldReduceMotion || !wideViewport
    ? {}
    : {
        variants: slideFromLeft,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.28 },
      };

  const slideRightProps = shouldReduceMotion || !wideViewport
    ? {}
    : {
        variants: slideFromRight,
        initial: "hidden",
        whileInView: "visible",
        viewport: { once: true, amount: 0.28 },
      };

  useEffect(() => {
    if (shouldReduceMotion) {
      setLoading(false);
      return;
    }

    const timer = window.setTimeout(() => setLoading(false), 1150);
    return () => window.clearTimeout(timer);
  }, [shouldReduceMotion]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 861px)");
    const onChange = () => setWideViewport(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setSelectedBusiness(null);
        setLightbox(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      document.body.classList.add("lock-scroll");
      requestAnimationFrame(() => {
        document.querySelector<HTMLAnchorElement>(".mobile-panel a")?.focus();
      });
    } else {
      document.body.classList.remove("lock-scroll");
      previousFocus.current?.focus?.();
    }
  }, [menuOpen]);

  useEffect(() => {
    if (selectedBusiness || lightbox !== null) {
      previousFocus.current = document.activeElement as HTMLElement;
      document.body.classList.add("lock-scroll");
      requestAnimationFrame(() => {
        document.querySelector<HTMLButtonElement>(".modal .close-modal")?.focus();
      });
    } else if (!menuOpen) {
      document.body.classList.remove("lock-scroll");
      previousFocus.current?.focus?.();
    }
  }, [selectedBusiness, lightbox, menuOpen]);

  const visibleBusinesses = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return businesses.filter((business) => {
      const matchesFilter =
        activeFilter === "All" || business.categories.includes(activeFilter);
      const haystack = `${business.name} ${business.categories.join(" ")} ${
        business.description
      }`.toLowerCase();
      return matchesFilter && (!normalized || haystack.includes(normalized));
    });
  }, [activeFilter, query]);

  const wellnessItems = businesses.filter((business) =>
    business.categories.some((category) =>
      ["Wellness & Beauty", "Health Club"].includes(category),
    ),
  );
  const activeWellnessBusiness =
    businesses.find((business) => business.id === activeWellness) ?? wellnessItems[0];

  const scrollToSection = (href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) {
      return;
    }

    const targetTop = getTargetTop(target);

    if (shouldReduceMotion) {
      window.scrollTo(0, targetTop);
      return;
    }

    animatePageScroll(targetTop);
  };

  const browseFilter = (filter: "All" | Category) => {
    setActiveFilter(filter);
    setQuery("");
    scrollToSection("#explore");
  };

  const handleAnchorClick = (
    event: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("#")) {
      return;
    }

    event.preventDefault();
    scrollToSection(href);
  };

  const openDetails = (business: Business) => {
    previousFocus.current = document.activeElement as HTMLElement;
    setSelectedBusiness(business);
  };

  const closeDetails = () => {
    setSelectedBusiness(null);
    previousFocus.current?.focus?.();
  };

  const nextGallery = () =>
    setActiveGallery((index) => (index + 1) % gallery.length);
  const prevGallery = () =>
    setActiveGallery((index) => (index - 1 + gallery.length) % gallery.length);

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            className="preloader"
            role="status"
            aria-live="polite"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeOut" } }}
          >
            <motion.div
              className="preloader-inner"
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55, ease: easeOut }}
            >
              <img src={assets.logo} alt="" />
              <p>International Club</p>
              <span>Surendra Bhawan . Sanepa</span>
              <motion.div
                className="preloader-line"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: easeOut }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a
          className="brand"
          href="#top"
          aria-label="International Club home"
          onClick={(event) => handleAnchorClick(event, "#top")}
        >
          <img src={assets.logo ?? assets.hero} alt="" />
          <span>
            <strong>International Club</strong>
            <small>Surendra Bhawan</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => handleAnchorClick(event, item.href)}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a
          className="visit-button desktop-visit"
          href="#visit"
          onClick={(event) => handleAnchorClick(event, "#visit")}
        >
          Plan Your Visit
        </a>
        <button
          ref={mobileMenuButton}
          className="icon-button mobile-toggle"
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>
      </header>

      {menuOpen && (
        <div className="mobile-menu" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            className="mobile-backdrop"
            aria-label="Close navigation menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="mobile-panel">
            <div className="mobile-panel-head">
              <span>International Club</span>
              <button
                className="icon-button"
                type="button"
                aria-label="Close navigation menu"
                onClick={() => {
                  setMenuOpen(false);
                  mobileMenuButton.current?.focus();
                }}
              >
                <X size={22} />
              </button>
            </div>
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => {
                  setMenuOpen(false);
                  handleAnchorClick(event, item.href);
                }}
              >
                {item.label}
              </a>
            ))}
            <a
              className="visit-button"
              href="#visit"
              onClick={(event) => {
                setMenuOpen(false);
                handleAnchorClick(event, "#visit");
              }}
            >
              Plan Your Visit
            </a>
          </div>
        </div>
      )}

      <main id="top">
        <motion.section
          className="hero"
          aria-labelledby="hero-title"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <motion.img
            className="hero-image"
            src={assets.hero}
            alt="International Club evening courtyard with illuminated white facades"
            fetchPriority="high"
            initial={shouldReduceMotion ? false : { scale: 1.04 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.1, ease: easeOut }}
          />
          <div className="hero-overlay" />
          <motion.div
            className="hero-content"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: shouldReduceMotion ? 0 : 0.25, ease: easeOut }}
          >
            <p className="eyebrow">Surendra Bhawan . Sanepa, Lalitpur</p>
            <h1 id="hero-title">One address. Many ways to spend the day.</h1>
            <p>
              Dining, wellness, shopping, and gatherings at International Club.
            </p>
            <div className="hero-actions">
              <a
                className="primary-link"
                href="#explore"
                onClick={(event) => handleAnchorClick(event, "#explore")}
              >
                Explore the Club <ArrowRight size={18} />
              </a>
              <a
                className="secondary-link"
                href="#visit"
                onClick={(event) => handleAnchorClick(event, "#visit")}
              >
                Plan Your Visit
              </a>
            </div>
          </motion.div>
        </motion.section>

        <motion.nav
          className="category-strip"
          aria-label="Quick category links"
          initial={shouldReduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.38, delay: shouldReduceMotion ? 0 : 0.85, ease: "easeOut" }}
        >
          {categoryLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(event) => {
                if (item.filter) {
                  event.preventDefault();
                  browseFilter(item.filter);
                } else {
                  handleAnchorClick(event, item.href);
                }
              }}
            >
              {item.label}
            </a>
          ))}
        </motion.nav>

        <motion.section className="intro" aria-labelledby="intro-title" {...revealProps}>
          <div className="intro-inner">
            <motion.div className="intro-copy" {...slideLeftProps}>
              <p className="section-label">International Club</p>
              <h2 id="intro-title">A Sanepa address made for lingering.</h2>
              <p>
                Move from courtyard coffee to lunch, a swim, a salon visit, or a
                quiet browse through the outlets. Surendra Bhawan gathers the day
                without turning it into an itinerary.
              </p>
              <div className="intro-cues" aria-label="Ways to spend time at International Club">
                <span>Eat</span>
                <span>Pause</span>
                <span>Browse</span>
                <span>Gather</span>
              </div>
            </motion.div>
            <motion.div className="intro-visual" {...slideRightProps}>
              <motion.figure className="intro-photo intro-photo-main" {...imageRevealProps}>
                <motion.img
                  src={assets.hokkaido}
                  alt="Hokkaido House dining room with warm brass lighting"
                  variants={shouldReduceMotion ? undefined : imageInnerReveal}
                />
                <figcaption>Dining rooms with their own character.</figcaption>
              </motion.figure>
              <motion.figure className="intro-photo intro-photo-side" {...imageRevealProps}>
                <motion.img
                  src={assets.luggageHunt}
                  alt="The Luggage Hunt storefront beside club arches"
                  variants={shouldReduceMotion ? undefined : imageInnerReveal}
                />
                <figcaption>Signs, storefronts, and courtyard routes.</figcaption>
              </motion.figure>

            </motion.div>
          </div>
        </motion.section>

        <motion.section
          className="directory section"
          id="explore"
          aria-labelledby="directory-title"
          {...directoryRevealProps}
        >
          <div className="section-heading">
            <p className="section-label">Explore</p>
            <h2 id="directory-title">Find your place inside.</h2>
            <p>
              Search by outlet name or filter by the kind of visit you have in mind.
            </p>
          </div>

          <div className="directory-tools">
            <label className="search-field">
              <Search size={18} />
              <span className="sr-only">Search businesses</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search outlets or categories"
              />
            </label>
            <div className="filters" role="group" aria-label="Filter businesses">
              {filters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={activeFilter === filter ? "is-active" : ""}
                  onClick={() => setActiveFilter(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {visibleBusinesses.length > 0 ? (
            <motion.div
              className="business-grid"
              aria-live="polite"
              variants={shouldReduceMotion ? undefined : staggerReveal}
              initial={shouldReduceMotion ? false : "hidden"}
              animate="visible"
            >
              <AnimatePresence mode="popLayout">
                {visibleBusinesses.map((business) => (
                  <motion.article
                    layout
                    variants={shouldReduceMotion ? undefined : cardReveal}
                    initial={shouldReduceMotion ? false : "hidden"}
                    animate="visible"
                    exit="exit"
                    className={`business-card ${business.featured ? "featured" : ""}`}
                    key={business.id}
                  >
                  <motion.div className="business-image" {...imageRevealProps}>
                    {business.image ? (
                      <motion.img
                        src={business.image}
                        alt={business.alt}
                        loading="lazy"
                        style={{ objectPosition: business.focal }}
                        variants={shouldReduceMotion ? undefined : imageInnerReveal}
                      />
                    ) : (
                      <div className="no-image" aria-hidden="true">
                        <span>{business.name.slice(0, 1)}</span>
                      </div>
                    )}
                  </motion.div>
                  <div className="business-body">
                    <p className="business-category">{business.categories.join(" / ")}</p>
                    <h3>{business.name}</h3>
                    <p>{business.description}</p>
                    <button type="button" onClick={() => openDetails(business)}>
                      View Details <ArrowRight size={16} />
                    </button>
                  </div>
                  </motion.article>
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <div className="empty-state" role="status">
              <h3>No matching outlet found.</h3>
              <p>Try a different search term or return to the complete directory.</p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveFilter("All");
                }}
              >
                Reset directory
              </button>
            </div>
          )}
        </motion.section>

        <motion.section className="dining section" id="dining" aria-labelledby="dining-title" {...revealProps}>
          <div className="dining-copy">
            <p className="section-label">Dining</p>
            <h2 id="dining-title">Stay for another course.</h2>
            <p>
              Japanese cuisine, Mediterranean dining, pizza, cafes, and something
              sweet, all within the club.
            </p>
            <button type="button" className="text-action" onClick={() => browseFilter("Dining & Cafes")}>
              Browse Dining <ArrowRight size={17} />
            </button>
            <div className="dining-palette" aria-label="Dining styles inside International Club">
              <span>Japanese</span>
              <span>Mediterranean</span>
              <span>Pizza</span>
              <span>Desserts</span>
            </div>
          </div>
          <div className="dining-collage">
            <motion.figure className="large" {...imageRevealProps}>
              <motion.img
                src={assets.blackGold}
                alt="Dining interior at The Black Gold"
                loading="lazy"
                variants={shouldReduceMotion ? undefined : imageInnerReveal}
              />
              <figcaption>The Black Gold</figcaption>
            </motion.figure>
            <motion.figure {...imageRevealProps}>
              <motion.img
                src={assets.pizza}
                alt="Fire and Ice Pizzeria hanging sign"
                loading="lazy"
                variants={shouldReduceMotion ? undefined : imageInnerReveal}
              />
              <figcaption>Fire and Ice Pizzeria</figcaption>
            </motion.figure>
            <motion.figure {...imageRevealProps}>
              <motion.img
                src={assets.sweetFix}
                alt="Sweet Fix dessert counter"
                loading="lazy"
                variants={shouldReduceMotion ? undefined : imageInnerReveal}
              />
              <figcaption>Sweet Fix</figcaption>
            </motion.figure>
          </div>
        </motion.section>

        <motion.section className="wellness section" id="wellness" aria-labelledby="wellness-title" {...revealProps}>
          <div className="wellness-media">
            <AnimatePresence mode="wait">
              {activeWellnessBusiness?.image ? (
                <motion.img
                  key={activeWellnessBusiness.id}
                  src={activeWellnessBusiness.image}
                  alt={activeWellnessBusiness.alt}
                  loading="lazy"
                  style={{ objectPosition: activeWellnessBusiness.focal }}
                  initial={shouldReduceMotion ? false : { opacity: 0.72, scale: 1.035 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0.55, scale: 1.015 }}
                  transition={{ duration: 0.62, ease: easeOut }}
                />
              ) : (
                <motion.div
                  key={activeWellnessBusiness?.id}
                  className="wellness-placeholder"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                >
                  <span>{activeWellnessBusiness?.name}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="wellness-copy">
            <p className="section-label">Wellness</p>
            <h2 id="wellness-title">A little time for yourself.</h2>
            <div className="wellness-list" role="tablist" aria-label="Wellness outlets">
              {wellnessItems.map((business) => (
                <button
                  key={business.id}
                  id={`tab-${business.id}`}
                  type="button"
                  role="tab"
                  aria-selected={activeWellness === business.id}
                  aria-controls="wellness-panel"
                  className={activeWellness === business.id ? "is-active" : ""}
                  onClick={() => setActiveWellness(business.id)}
                >
                  <span>{business.name}</span>
                  <small>{business.description}</small>
                </button>
              ))}
            </div>
            <div
              id="wellness-panel"
              className="wellness-detail"
              role="tabpanel"
              aria-labelledby={`tab-${activeWellnessBusiness?.id}`}
            >
              <h3>{activeWellnessBusiness?.name}</h3>
              <p>{activeWellnessBusiness?.detail}</p>
            </div>
          </div>
        </motion.section>

        <motion.section className="gallery-section section" aria-labelledby="gallery-title" {...revealProps}>
          <div className="section-heading compact">
            <p className="section-label">Walk Through</p>
            <h2 id="gallery-title">Past the signs and into the courtyard.</h2>
          </div>
          <div className="gallery-view">
            <button
              type="button"
              className="gallery-control"
              aria-label="Previous photo"
              onClick={prevGallery}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="gallery-image-button"
              onClick={() => setLightbox(activeGallery)}
              aria-label={`Open larger image: ${gallery[activeGallery].caption}`}
            >
              <motion.img
                key={gallery[activeGallery].src}
                src={gallery[activeGallery].src}
                alt={gallery[activeGallery].alt}
                style={{ objectPosition: gallery[activeGallery].focal }}
                initial={shouldReduceMotion ? false : { opacity: 0.72, scale: 1.035 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.55, ease: easeOut }}
              />
              <span>{gallery[activeGallery].caption}</span>
            </button>
            <button
              type="button"
              className="gallery-control"
              aria-label="Next photo"
              onClick={nextGallery}
            >
              <ChevronRight size={22} />
            </button>
          </div>
          <div className="gallery-thumbs" aria-label="Gallery thumbnails">
            {gallery.map((item, index) => (
              <button
                key={item.caption}
                type="button"
                aria-label={`Show ${item.caption}`}
                className={activeGallery === index ? "is-active" : ""}
                onClick={() => setActiveGallery(index)}
              >
                <img src={item.src} alt="" loading="lazy" style={{ objectPosition: item.focal }} />
              </button>
            ))}
          </div>
        </motion.section>

        <motion.section className="events" id="events" aria-labelledby="events-title" {...revealProps}>
          <motion.img
            src={assets.hero}
            alt=""
            loading="lazy"
            initial={shouldReduceMotion ? false : { scale: 1.08, opacity: 0.78 }}
            whileInView={{ scale: 1, opacity: 0.78 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 1.35, ease: easeOut }}
          />
          <div className="events-copy">
            <p className="section-label">Events</p>
            <h2 id="events-title">A setting to come together.</h2>
            <p>
              Planning a gathering? Get in touch to discuss the occasion and the
              space you need.
            </p>
            <a className="primary-link" href="#visit">
              Enquire About an Event <ArrowRight size={18} />
            </a>
          </div>
        </motion.section>

        <motion.section className="visit section" id="visit" aria-labelledby="visit-title" {...revealProps}>
          <motion.div className="visit-copy" {...slideLeftProps}>
            <p className="section-label">Visit</p>
            <h2 id="visit-title">Find us in Sanepa.</h2>
            <p>
              International Club - Surendra Bhawan brings eateries, wellness,
              retail, and gathering spaces together in Lalitpur.
            </p>
            <p>
              Use the directions link for a map search to the club, and check
              Instagram for current outlet updates.
            </p>
          </motion.div>
          <motion.div className="visit-panel" {...slideRightProps}>
            <h3>International Club - Surendra Bhawan</h3>
            <p>
              <MapPin size={18} />
              Sanepa, Lalitpur, Nepal
            </p>
            <a
              href="https://www.google.com/maps/search/?api=1&query=International%20Club%20Surendra%20Bhawan%20Sanepa%20Lalitpur%20Nepal"
              target="_blank"
              rel="noreferrer"
            >
              Directions <ExternalLink size={16} />
            </a>
            <a
              href="https://www.instagram.com/internationalclub.np/"
              target="_blank"
              rel="noreferrer"
            >
              <AtSign size={17} /> @internationalclub.np
            </a>
            <p className="note">
              Phone, email, opening hours, and booking links were not supplied, so
              they are intentionally omitted.
            </p>
          </motion.div>
        </motion.section>

        <motion.section className="triovate-promo" aria-labelledby="triovate-title" {...revealProps}>
          <div className="triovate-inner">
            <p className="section-label">Prepared by Triovate Labs</p>
            <h2 id="triovate-title">
              We shaped this digital experience to feel as considered as the
              destination itself.
            </h2>
            <a className="triovate-cta" href="mailto:triovatelabs@gmail.com">
              Discuss a Project <ArrowRight size={19} />
            </a>
            <div className="triovate-links" aria-label="Triovate Labs contact links">
              <a href="https://triovatelabs.com" target="_blank" rel="noreferrer">
                <Globe size={18} /> triovatelabs.com
              </a>
              <a href="mailto:triovatelabs@gmail.com">
                <Mail size={18} /> triovatelabs@gmail.com
              </a>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>International Club</strong>
          <p>Health Club . Eateries . Events . Outlets.</p>
        </div>
        <nav aria-label="Footer navigation">
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <p>Sanepa, Lalitpur, Nepal</p>
        <p>Copyright {new Date().getFullYear()} International Club.</p>
      </footer>

      {selectedBusiness && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="business-modal-title">
          <button className="modal-backdrop" aria-label="Close details" onClick={closeDetails} />
          <article className="detail-panel">
            <button className="icon-button close-modal" type="button" aria-label="Close details" onClick={closeDetails}>
              <X size={22} />
            </button>
            {selectedBusiness.image ? (
              <img
                className="detail-image"
                src={selectedBusiness.image}
                alt={selectedBusiness.alt}
                style={{ objectPosition: selectedBusiness.focal }}
              />
            ) : (
              <div className="detail-image no-image">
                <span>{selectedBusiness.name.slice(0, 1)}</span>
              </div>
            )}
            <div className="detail-content">
              <p className="business-category">{selectedBusiness.categories.join(" / ")}</p>
              <h2 id="business-modal-title">{selectedBusiness.name}</h2>
              <p>{selectedBusiness.detail}</p>
              <a href="#visit" onClick={closeDetails}>
                Visit Information <ArrowRight size={16} />
              </a>
            </div>
          </article>
        </div>
      )}

      {lightbox !== null && (
        <div className="modal lightbox" role="dialog" aria-modal="true" aria-label="Gallery image">
          <button className="modal-backdrop" aria-label="Close image" onClick={() => setLightbox(null)} />
          <figure className="lightbox-panel">
            <button className="icon-button close-modal" type="button" aria-label="Close image" onClick={() => setLightbox(null)}>
              <X size={22} />
            </button>
            <img src={gallery[lightbox].src} alt={gallery[lightbox].alt} />
            <figcaption>{gallery[lightbox].caption}</figcaption>
          </figure>
        </div>
      )}

      <AnimatePresence>
        {scrolled && (
          <motion.button
            className="scroll-top-button"
            type="button"
            aria-label="Scroll to top"
            onClick={() => scrollToSection("#top")}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 14, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: 14, scale: 0.92 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
          >
            <ChevronUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
