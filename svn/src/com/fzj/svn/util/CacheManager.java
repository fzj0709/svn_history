package com.fzj.svn.util;

import java.io.Serializable;
import java.util.concurrent.ConcurrentHashMap;

import org.ehcache.Cache;
import org.ehcache.config.builders.CacheConfigurationBuilder;
import org.ehcache.config.builders.CacheManagerBuilder;
import org.ehcache.config.builders.ResourcePoolsBuilder;


public class CacheManager{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private static CacheManager instance;
	private static Object lock = new Object();
	private static org.ehcache.CacheManager cacheManager;
	private static  Cache<String, ConcurrentHashMap>  cache;

	static{
		cacheManager = (org.ehcache.CacheManager) CacheManagerBuilder  
                .newCacheManagerBuilder()  
                .withCache(  
                        "cache",  
                        CacheConfigurationBuilder.newCacheConfigurationBuilder(  
                                String.class, ConcurrentHashMap.class,  
                                ResourcePoolsBuilder.heap(100)).build())  
                .build(true);  
	}
	private CacheManager() {
       cache = ((org.ehcache.CacheManager) cacheManager).getCache(  
                "cache", String.class, ConcurrentHashMap.class);  
	}

	public static CacheManager getInstance() {
		if (instance == null) {
			synchronized (lock) {
				if (instance == null) {
					instance = new CacheManager();
				}
			}
		}
		return instance;
	}

	public void putData(String map_id, ConcurrentHashMap obj) {
		cache.put(map_id, obj);
	}

	public void removeData(String map_id) {
		cache.remove(map_id);
	}

	public void removeAllData() {
		cache.clear();
	}

	public static Cache<String, ConcurrentHashMap> getCache() {
		return cache;
	}

	public static void setCache(Cache<String, ConcurrentHashMap> cache) {
		CacheManager.cache = cache;
	}

	public void refreshAll() {
		IniReader.reloadCacheIni("svn.ini");
	}
}
