import { SVGProps, useEffect, useRef, useState } from 'react';

export function useDynamicSvgImport(iconName: string) {
  const importedIconRef = useRef<React.FC<SVGProps<SVGSVGElement>> | null>(null);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState<unknown>();

  useEffect(() => {
    setLoading(true);
    // dynamically import the mentioned svg icon name in props
    const importSvgIcon = async (): Promise<void> => {
      // please make sure all your svg icons are placed in the same directory
      // if we want that part to be configurable then instead of iconName we will send iconPath as prop
      try {
        const ReactComponent = (await import(`../../assets/icons/${iconName}.svg`))
          .default;
        importedIconRef.current = ReactComponent as React.FC<SVGProps<SVGSVGElement>>;
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    importSvgIcon();
  }, [ iconName ]);

  return { error, loading, Icon: importedIconRef.current };
}

export default useDynamicSvgImport;
