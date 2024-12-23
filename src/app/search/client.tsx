"use client";
import { useState, useEffect } from "react";

import { classNames } from "@/tools/css_tools";
import { useDebounce } from "use-debounce";

import { useHeaderTitle } from "@/states/layoutState";

// Components
import { Input, Button, List, Divider, Tooltip } from "antd";
import { FlexDiv, Center } from "@/components/container";
import { AdaptiveItemGrid, SearchResultList } from "@/cus_components/item";

// Api
import { searchItemsByName, searchItemsByTags } from "@/api/search";
import { ItemIn } from "@/api/item";

export function Client() {
  useHeaderTitle("物品搜索");

  const [searchKeyword, setSearchKeyword] = useState("");
  const [debouncedKeyword, setDebouncedKeyword] = useDebounce(
    searchKeyword,
    500,
  ); // 500ms debounce time
  const [nameResults, setNameResults] = useState<ItemIn[]>([]);
  const [tagResults, setTagResults] = useState<ItemIn[]>([]);

  useEffect(() => {
    async function fetchResults() {
      if (!debouncedKeyword) {
        setNameResults([]);
        setTagResults([]);
        return;
      }

      try {
        const [nameRes, tagRes] = await Promise.all([
          searchItemsByName({
            keyword: debouncedKeyword,
            pagination: { index: 0, size: 10 },
          }),
          searchItemsByTags({
            keyword: debouncedKeyword,
            pagination: { index: 0, size: 10 },
          }),
        ]);

        setNameResults((nameRes as any)?.results || []);
        setTagResults((tagRes as any)?.results || []);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }

    fetchResults();
  }, [debouncedKeyword]);

  return (
    // Root AutoScroll
    <FlexDiv
      expand
      className={classNames(
        "flex-col items-center justify-start gap-4",
        "bg-fgcolor dark:bg-fgcolor-dark",
        "overflow-auto",
        "pt-4", // Initial top padding to avoid content too close to header bar.
      )}
    >
      <FlexDiv
        expand
        className={classNames(
          "max-w-[50rem] flex-col items-center justify-start gap-4",
        )}
      >
        <Input
          placeholder="请输入关键字或标签进行搜索"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          className="w-full max-w-[40rem]"
        />

        <Divider orientation="left">按物品名搜索</Divider>
        {nameResults.length ? (
          <SearchResultList
            searchResults={nameResults}
            showAllUrl="/home"
          ></SearchResultList>
        ) : (
          <p className="text-gray-500">暂无搜索结果</p>
        )}

        <Divider orientation="left">按标签搜索</Divider>
        {tagResults.length ? (
          <SearchResultList
            searchResults={tagResults}
            showAllUrl="/home"
          ></SearchResultList>
        ) : (
          <p className="text-gray-500">暂无搜索结果</p>
        )}
      </FlexDiv>
    </FlexDiv>
  );
}
