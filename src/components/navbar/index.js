import React, { useEffect, useState } from "react";
import { StaticQuery, graphql, Link } from "gatsby";

import { CATEGORY } from "../../constants";
import { NavbarList } from "../navbar-list";

import "./index.scss";

export const Navbar = ({
  handlePageChange,
  handleSelect,
  selectedCategory,
  currentPage,
}) => {
  const [show, setShow] = useState(selectedCategory);

  const handleClick = (e, link) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("handleClick");
    if (show === link) {
      setShow(CATEGORY.ALL);
    } else if (link.includes("/")) {
      setShow(link.split("/")[0]);
    } else {
      setShow(link.toLowerCase());
    }

    currentPage !== 1 && handlePageChange(1);
    handleSelect(link?.toLowerCase());
  };

  return (
    <StaticQuery
      query={navQuery}
      render={(data) => {
        const { blogName, githubUrl } = data.site.siteMetadata;
        const navLists = data.allDirectory.edges;

        return (
          <div className="navbarContainer">
            <div className="navbarName">{blogName}</div>
            <div className="navbarItems">
              <Link to="/" className="navbarItem">
                Home
              </Link>
              <Link to={githubUrl} target="_blank" className="navbarItem">
                Github
              </Link>
            </div>
            <hr />
            <NavbarList
              show={show}
              navLists={navLists}
              handleClick={handleClick}
              selectedCategory={selectedCategory}
            />
          </div>
        );
      }}
    />
  );
};

const navQuery = graphql`
  query NavQuery {
    site {
      siteMetadata {
        blogName
        githubUrl
      }
    }
    allDirectory(
      filter: {
        sourceInstanceName: { eq: "content" }
        relativePath: { ne: "" }
      }
      sort: { relativePath: ASC }
    ) {
      edges {
        node {
          sourceInstanceName
          relativeDirectory
          relativePath
          name
        }
      }
    }
  }
`;
