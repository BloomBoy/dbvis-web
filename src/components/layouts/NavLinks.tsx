import Link from 'next/link';

const NavLinks = () => {
  return (
    <>
      {[
        ['Features', '#features'],
        ['Databases', '#databases'],
        ['Pricing', '#pricing'],
        ['Buy', '#buy'],
        ["What's new", '#whatsnew'],
        ['Support', '#support'],
      ].map(([label, href], _index) => (
        <Link
          key={label}
          href={href}
          className="-my-2 -mx-3 rounded-lg px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
        >
          <a className="relative z-10 hidden lg:inline-flex flex-auto ">
            {label}
          </a>
        </Link>
      ))}
    </>
  );
};

export default NavLinks;
