import LegacyScriptRunner from "@/components/legacy-script-runner";
import PageMotionEnhancer from "@/components/page-motion-enhancer";

type LegacyPageProps = {
  bodyHtml: string;
  bodyClassName?: string;
  styles: string[];
  scripts: string[];
};

export default function LegacyPage({ bodyHtml, bodyClassName, styles, scripts }: LegacyPageProps) {
  return (
    <>
      {styles.map((style, index) => (
        <style key={`legacy-style-${index}`} dangerouslySetInnerHTML={{ __html: style }} />
      ))}
      <main className={bodyClassName} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      <PageMotionEnhancer />
      <LegacyScriptRunner scripts={scripts} />
    </>
  );
}
