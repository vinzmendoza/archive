import NextLink from "next/link";

const Item = ({ item }) => {
  return (
    <div className="p-2 divide-y divide-gray-700 rounded dark:bg-gray-800">
      <NextLink href={`/items/${item.id}`} passHref>
        <div className="p-4 overflow-hidden rounded cursor-pointer dark:bg-gray-800 group text-ellipsis">
          <a className="text-3xl dark:group-hover:text-gray-400 ">
            {item.title}
          </a>
        </div>
      </NextLink>

      <ul className="relative flex flex-wrap items-center justify-start p-4 ">
        {item.tags.slice(0, 7).map((tag, index) => {
          return (
            <li key={tag.id} className="mb-2 mr-2">
              <NextLink
                href={`/search/tags?val=${tag.name}`}
                key={tag.id}
                passHref
              >
                <p
                  className={`flex items-center justify-center px-3 py-1  rounded-md cursor-pointer dark:bg-gray-600 dark:hover:bg-gray-700 ${
                    index + 1 > 6 && "hidden"
                  }`}
                >
                  {tag.name}
                </p>
              </NextLink>
              {index === 6 && (
                <NextLink href={`/items/${item.id}`} key={item.id} passHref>
                  <div className="flex items-center px-2 py-1 rounded-md hover:cursor-pointer dark:hover:bg-gray-700">
                    <p className="text-xs text-gray-300">See all tags</p>
                  </div>
                </NextLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Item;
