package com.fzj.svn.util;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Iterator;
import org.ehcache.Cache.Entry;
import org.ehcache.Cache;
import org.ehcache.Cache.Entry;
import org.ehcache.CacheManager;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.CacheManagerBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;

public class Test {  
    public static void main(String[] args) {  
        CacheManager cacheManager = CacheManagerBuilder  
                .newCacheManagerBuilder()  
                .withCache(  
                        "preConfigured",  
                        CacheConfigurationBuilder.newCacheConfigurationBuilder(  
                                Long.class, String.class,  
                                ResourcePoolsBuilder.heap(100)).build())  
                .build(true);  
  
        Cache<Long, String> preConfigured = cacheManager.getCache(  
                "preConfigured", Long.class, String.class);  
  
        Cache<Long, String> myCache = cacheManager.createCache(  
                "myCache",  
                CacheConfigurationBuilder.newCacheConfigurationBuilder(  
                        Long.class, String.class,  
                        ResourcePoolsBuilder.heap(100)).build());  
          
        preConfigured.put(2L, "hello Ehcache");  
        String value1=preConfigured.get(2L);  
        System.out.println(value1);  
        myCache.put(1L, "da one!");  
        String value = myCache.get(1L);  
        System.out.println(value); 
        System.out.println(myCache);
        myCache.clear();
		for(Iterator<Entry<Long, String>> it=myCache.iterator();it.hasNext();){
			Entry<Long, String> entry = it.next();
			System.out.println(entry.getKey());
			System.out.println(entry.getValue());
		}

        cacheManager.close();  
        
        Calendar calendar = Calendar.getInstance();
        
        System.out.println(new SimpleDateFormat("yyyy:MM:dd hh:mm:ss").format(calendar.getTime()));
  
    }  
}  