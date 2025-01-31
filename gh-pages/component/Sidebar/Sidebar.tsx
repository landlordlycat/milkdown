import { LocationType, useLocationType } from '../hooks/useLocationType';
import React from 'react';
import { NavLink as Link } from 'react-router-dom';

import className from './style.module.css';

const NavLink: React.FC<Item> = ({ title, link }) => (
    <Link className={className.link} activeClassName={className.active} to={link}>
        {title}
    </Link>
);

const NavSection: React.FC<Section> = ({ title, items }) => (
    <section className={className.section}>
        <section className={className.sectionTitle}>{title}</section>
        {items.map((item, i) => (
            <NavLink key={i.toString()} {...item} />
        ))}
    </section>
);

type Item = {
    title: string;
    link: string;
    content: string;
};
export type Section = {
    title: string;
    items: Item[];
};

type SidebarProps = {
    sections: Section[];
    display: boolean;
    setDisplay: (display: boolean) => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ sections, setDisplay, display }) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const [locationType, location] = useLocationType();

    React.useEffect(() => {
        if (locationType !== LocationType.Page) {
            setDisplay(false);
            return;
        }
        if (document.documentElement.clientWidth < 1080) {
            setDisplay(false);
            return;
        }
        setDisplay(true);
        const { current } = ref;
        if (!current) return;
        const header = document.getElementById('header');
        const scroll = document.createElement('div');
        scroll.style.position = 'fixed';
        scroll.style.right = '0';
        scroll.style.top = '0';
        scroll.style.bottom = '0';
        scroll.style.background = 'rgba(var(--background), 1)';
        scroll.style.zIndex = '99';
        const stopBodyScroll = () => {
            const width = window.innerWidth - document.body.clientWidth;
            document.body.style.marginRight = `${width}px`;
            document.body.style.overflow = 'hidden';
            scroll.style.width = width + 'px';
            document.body.style.transition = 'none';
            if (header) {
                header.style.marginRight = `${width}px`;
                header.style.transition = 'none';
            }
            document.body.appendChild(scroll);
        };
        const resumeBodyScroll = () => {
            document.body.style.overflow = '';
            document.body.style.marginRight = '';
            setTimeout(() => {
                document.body.style.transition = '';
                if (header) {
                    header.style.transition = '';
                }
            }, 400);
            if (header) {
                header.style.marginRight = '';
            }
            document.body.removeChild(scroll);
        };
        current.addEventListener('mouseenter', stopBodyScroll);
        current.addEventListener('mouseleave', resumeBodyScroll);
        return () => {
            current.removeEventListener('mouseenter', stopBodyScroll);
            current.removeEventListener('mouseleave', resumeBodyScroll);
        };
    }, [locationType, setDisplay, location]);

    const navClassName = React.useMemo(() => `${className.sidebar} ${display ? '' : className.fold}`, [display]);

    return (
        <nav ref={ref} className={navClassName}>
            {sections.map((section, i) => (
                <section key={i.toString()}>
                    <NavSection key={i.toString()} {...section} />
                    {i < sections.length - 1 && <hr className={className.hr} />}
                </section>
            ))}
        </nav>
    );
};
