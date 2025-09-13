import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Collection = () => {
  const { products , search , showSearch } = useContext(ShopContext);
  const [showFilter,setShowFilter] = useState(false);
  const [filterProducts,setFilterProducts] = useState([]);
  const [category,setCategory] = useState([]);
  const [subCategory,setSubCategory] = useState([]);
  const [sortType,setSortType] = useState('relavent');
  const [aiKeywords, setAiKeywords] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [refinedTitles, setRefinedTitles] = useState([]);
  const [isRefining, setIsRefining] = useState(false);
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
  const fetchKeywordsFromAI = async (query) => {
    if (!query) {
      setAiKeywords([]);
      return;
    }
    setIsAiLoading(true);

    const systemPrompt = "You are an expert fashion stylist. Based on the user's query, provide a list of relevant keywords to filter products by. Include categories, materials, and styles. Respond only with a JSON array of strings.";
    const userQuery = `Generate keywords for: "${query}"`;
    
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "STRING",
          },
        },
      },
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const keywords = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (keywords) {
        const parsedKeywords = JSON.parse(keywords);
        
        setAiKeywords(parsedKeywords);
      } else {
        setAiKeywords([]);
      }
    } catch (error) {
      setAiKeywords([]);
    } finally {
      setIsAiLoading(false);
    }
  };
   const fetchRefinedTitlesFromAI = async (originalQuery, productTitles) => {
    if (!originalQuery || !productTitles || productTitles.length === 0) {
      setRefinedTitles([]);
      return;
    }
    setIsRefining(true);
    const systemPrompt = "You are a highly discerning fashion expert. Given a list of product titles and an original search query, your task is to identify and return only the titles that are highly relevant to the query. Respond only with a JSON array of strings containing the relevant product titles.";
    const userQuery = `Original query: "${originalQuery}". Products to filter: ${JSON.stringify(productTitles)}`;
    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "STRING",
          },
        },
      },
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
    };
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      const refinedTitles = result.candidates?.[0]?.content?.parts?.[0]?.text;

      if (refinedTitles) {
        const parsedTitles = JSON.parse(refinedTitles);
        setRefinedTitles(parsedTitles);
      } else {
        setRefinedTitles(productTitles);
      }
    } catch (error) {
      setRefinedTitles(productTitles);
    } finally {
      setIsRefining(false);
    }
  };
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
        setCategory(prev=> prev.filter(item => item !== e.target.value))
    } else {
      setCategory(prev => [...prev, e.target.value])
    }
  }
  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory(prev=> prev.filter(item => item !== e.target.value))
    } else {
      setSubCategory(prev => [...prev, e.target.value])
    }
  }
  const applyFiltersAndSort = () => {
    let productsCopy = products.slice();
    if (showSearch && aiKeywords.length > 0) {
      productsCopy = productsCopy.filter(item => 
        aiKeywords.some(keyword => 
          item.name.toLowerCase().includes(keyword.toLowerCase()) || 
          item.description.toLowerCase().includes(keyword.toLowerCase())
        )
      );
    } else if (showSearch && search) {
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
    }
    if (showSearch && refinedTitles.length > 0) {
      productsCopy = productsCopy.filter(item => refinedTitles.includes(item.name));
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory))
    }
    switch (sortType) {
      case 'low-high':
        productsCopy = productsCopy.sort((a,b)=>(a.price - b.price));
        break;
      case 'high-low':
        productsCopy = productsCopy.sort((a,b)=>(b.price - a.price));
        break;
      default:
        break;
    }

    setFilterProducts(productsCopy);
  };
  useEffect(() => {
    if (showSearch && search) {
      fetchKeywordsFromAI(search);
    } else {
      setAiKeywords([]);
    }
  }, [search, showSearch]);
  useEffect(() => {
    if (showSearch && aiKeywords.length > 0) {
      const initialFilteredTitles = products
        .filter(item => 
          aiKeywords.some(keyword => 
            item.name.toLowerCase().includes(keyword.toLowerCase()) || 
            item.description.toLowerCase().includes(keyword.toLowerCase())
          )
        )
        .map(item => item.name);
      
      fetchRefinedTitlesFromAI(search, initialFilteredTitles);
    } else {
      setRefinedTitles([]);
    }
  }, [aiKeywords, search, showSearch, products]);

  useEffect(() => {
    applyFiltersAndSort();
  }, [category, subCategory, sortType, aiKeywords, refinedTitles, showSearch, search, products]);

  return (
    <>
    <div className='flex flex-col px-[10px] sm:flex-row gap-1 sm:gap-10 pt-10 border-t'>
      
      <div className='min-w-60'>
        <p onClick={()=>setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Men'} onChange={toggleCategory}/> Men
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Women'} onChange={toggleCategory}/> Women
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Kids'} onChange={toggleCategory}/> kids
            </p>
          </div>
        </div>
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' :'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Topwear'} onChange={toggleSubCategory}/> Topwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Bottomwear'} onChange={toggleSubCategory}/> Bottomwear
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Winterwear'} onChange={toggleSubCategory}/> Winterwear
            </p>
          </div>
        </div>
      </div>
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
            <Title text1={'ALL'} text2={'COLLECTIONS'} />
            <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
              <option value="relavent">Sort by: Relavent</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            (isAiLoading || isRefining) ? (
              <div className="flex justify-center items-center w-full col-span-full h-64 text-gray-500">
                <p>Generating vibe results...</p>
              </div>
            ) : (
              filterProducts.map((item,index)=>(
                <ProductItem key={index} name={item.name} id={item._id} price={item.price} image={item.image} />
              ))
            )
          }
        </div>
      </div>
    </div>
    <Footer/>
    </>
  )
}
export default Collection

