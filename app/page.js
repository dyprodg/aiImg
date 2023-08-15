'use client'
import { useRef, useState } from 'react';
import { OPTIONS } from '@/lib/constants';
import Option from '@/components/Option';

export default function Home() {
  const promptRef = useRef();
  const [renderedImages, setRenderedImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const appendPrompt = (word) => {
    promptRef.current.value = promptRef.current.value.concat(", ", word);
  };

  const handleGenerateImage = async () => {
    setLoading(true);
    try {
      const resp = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: promptRef.current.value }),
      });

      if (!resp.ok) {
        throw new Error("Unable to generate the image");
      }

      const data = await resp.json();
      console.log(data);

      setRenderedImages(data.data);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col max-w-4xl mx-auto">
      <section className="flex items-center gap-2 px-6 py-6">
        <h2>Prompt</h2>
        <input
          type="text"
          className="w-full text-black outline-none py-2 px-6 bg-gray-300 rounded-3xl shadow-inner"
          placeholder="a woman walking her dog, a ballerina dancing,..."
          defaultValue="a dog playing ball"
          ref={promptRef}
        />
      </section>
      <section className="grid gap-4">
        {/* Left */}
        <div className="flex flex-col gap-6 px-6 py-6">
          <button 
            disabled={loading}
            onClick={handleGenerateImage}
            className="py-2 px-6 bg-white text-black rounded-3xl transition duration-300 transform hover:scale-110"
          >
            {loading ? "Generating, please wait..." : "Generate"}
          </button>
  
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="spinner"></div>
            </div>
          ) : (
            renderedImages.map((image) => {
              return <img key={image.url} src={image.url} />;
            })
          )}
          
        </div>
        {/* Right */}
        <div className="hidden md:block py-6 text-2xl">
          <h2> Other Options</h2>
          {OPTIONS.map(option => {
            return <Option
              key={option.title}
              title={option.title}
              values={option.values}
              onAppend={appendPrompt}
            />
          })}
        </div>
      </section>
    </main>
  )
  
}
