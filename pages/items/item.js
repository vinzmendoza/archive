import NextLink from "next/link";

const Item = ({ item }) => {
  return (
    <div className="rounded dark:bg-gray-600">
      <NextLink href={`/items/${item.id}`} passHref>
        <div className="p-4 rounded cursor-pointer dark:bg-gray-600 group">
          <a className="text-2xl dark:group-hover:text-gray-300">
            {item.title}
          </a>
        </div>
      </NextLink>

      <ul className="flex flex-wrap items-start justify-start px-4 pt-2 pb-4 mt-4 ">
        {item.tags.map((tag, index) => {
          return (
            <NextLink
              href={`/search/tags?val=${tag.name}`}
              key={tag.id}
              passHref
            >
              <li className="flex items-center justify-center px-3 py-1 mb-2 mr-2 bg-blue-600 rounded cursor-pointer hover:bg-blue-700">
                {tag.name}
              </li>
            </NextLink>
          );
        })}
      </ul>
    </div>
  );
};

export default Item;
