23:32:38.902 
 ✓ Compiled successfully in 7.9s
23:32:38.905 
   Linting and checking validity of types ...
23:32:42.054 
Failed to compile.
23:32:42.055 
23:32:42.055 
./src/components/experiment/BasicInfoPage.tsx:93:26
23:32:42.055 
Type error: Property 'experimentData' does not exist on type 'ExperimentContextType'.
23:32:42.055 
23:32:42.055 
  91 |
23:32:42.055 
  92 | export default function BasicInfoPage() {
23:32:42.056 
> 93 |   const { step, setStep, experimentData, updateBasicInfo, updateSocialInfluence } = useExperiment();
23:32:42.056 
     |                          ^
23:32:42.056 
  94 |   const isSocialInfluence = step === 'social-influence';
23:32:42.056 
  95 |   
23:32:42.056 
  96 |   const [currentBasic, setCurrentBasic] = useState(0);
23:32:42.079 
Next.js build worker exited with code: 1 and signal: null
23:32:42.108 
Error: Command "npm run build" exited with 1
