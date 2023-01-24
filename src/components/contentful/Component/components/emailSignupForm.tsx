import { SyntheticEvent, useEffect, useRef, useState } from 'react';
import type { ComponentProps } from '..';
import { SafeEntryFields } from 'src/utils/contentful';
import classNames from 'classnames';
import RichText from 'src/components/RichText';

type NewsletterSignupProps = {
  buttonText?: SafeEntryFields.Symbol;
  alignment?: string;
  termsText?: SafeEntryFields.RichText;
  placeholderText?: SafeEntryFields.Symbol;
};

function SubmitButton({
  isLoading,
  className,
  title = 'Submit',
  onClick,
  disabled = false,
}: {
  disabled?: boolean;
  isLoading: boolean;
  className: string;
  title?: string;
  onClick: (event: SyntheticEvent) => void;
}) {
  const [throbberVisible, setThrobberVisible] = useState(isLoading);
  const throbberVisibleRef = useRef(throbberVisible);
  throbberVisibleRef.current = throbberVisible;
  const isLoadingRef = useRef(isLoading);
  isLoadingRef.current = isLoading;
  const [animationEl, setAnimationEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    function transitionEndHandler() {
      if (!isLoadingRef.current) setThrobberVisible(false);
    }
    function transitionStartHandler() {
      if (isLoadingRef.current) setThrobberVisible(true);
    }
    if (animationEl) {
      animationEl.addEventListener('transitionend', transitionEndHandler);
      animationEl.addEventListener('transitionstart', transitionStartHandler);
    }
    return () => {
      if (animationEl) {
        animationEl.removeEventListener('transitionend', transitionEndHandler);
        animationEl.removeEventListener(
          'transitionstart',
          transitionStartHandler,
        );
      }
    };
  }, [animationEl]);

  return (
    <button
      onClick={onClick}
      className={classNames(
        'right-4 t-4 items-stretch place-content-stretch text-white flex disabled:opacity-60 transition-opacity bg-grey-900 rounded-full py-2 md:py-4 px-12 h-[55%]',
        className,
      )}
      disabled={disabled}
    >
      {throbberVisible && (
        <div
          className={classNames(
            'absolute z-10 animate-spin rounded-full top-[33%] left-5 h-4 w-4 border-b-2 border-current mr-2',
          )}
        />
      )}
      <div
        className={classNames(
          'relative pl-4 py-2 rounded-l-full leading-none uppercase font-mono bg-grey-900 transition-transform duration-150 translate-x-full',
          isLoading ? 'translate-x-0' : 'translate-x-4',
        )}
        ref={setAnimationEl}
      ></div>
      <div className="relative py-2 leading-none uppercase font-mono bg-grey-900 font-semibold self-center">
        {title}
      </div>
    </button>
  );
}
export default function NewsletterSignup(
  props: ComponentProps<NewsletterSignupProps>,
): JSX.Element | null {
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const { buttonText = 'SEND ->', termsText = '', placeholderText = 'ENTER EMAIL' } = props.data ?? {};
  return (
    <>
      <div>
        <form>
          <div className="mb-4 flex flex-col font-mono text-grey-600">
            <div className="relative flex w-full items-center mb-10">
              <input
                className="uppercase w-full font-extralight text-xl md:text-5xl py-3 md:py-4 pl-6 pr-6 md:pl-12 md:pr-72 border-grey-300 border rounded-full font-mono outline-none placeholder:text-grey-500"
                type="email"
                placeholder={placeholderText}
              />
              <SubmitButton
                isLoading={isLoading}
                title={buttonText}
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoading(!isLoading);
                }}
                disabled={!isTermsAccepted}
                className="absolute invisible md:visible h-full m-4"
              />
            </div>
            <div className="mb-4 flex font-mono text-grey-600">
              <input
                type="checkbox"
                id="accept"
                name="accept"
                checked={isTermsAccepted}
                onChange={(e) => setIsTermsAccepted(e.target.checked)}
                className="mb-4 shrink-0 self-center"
              />
              <label htmlFor="accept" className="px-4">
                {termsText ? <RichText content={termsText} /> : null}
              </label>
            </div>
            <div className="inline">
              <SubmitButton
                isLoading={isLoading}
                title={buttonText}
                onClick={(e) => {
                  e.preventDefault();
                  setIsLoading(!isLoading);
                }}
                disabled={!isTermsAccepted}
                className="relative md:hidden"
              />
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
