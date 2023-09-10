import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/LineupSelection.css";
import ResultModal from "../components/ResultModal";
import homeLogo from "../images/home-icon.png";

function BostonBruins() {
  const [gameDates, setGameDates] = useState([]);
  const [selectedGameDate, setSelectedGameDate] = useState("");
  const [forwardPlayers, setForwardPlayers] = useState([]);
  const [defensivePlayers, setDefensivePlayers] = useState([]);
  const [selectedForwardPlayers, setSelectedForwardPlayers] = useState([
    "",
    "",
    "",
  ]);
  const [selectedDefensivePlayers, setSelectedDefensivePlayers] = useState([
    "",
    "",
  ]);
  const [lineupMatchup, setLineupMatchup] = useState("");
  const [advice, setAdvice] = useState("");
  const [mostGoalsPlayer, setMostGoalsPlayer] = useState("");
  const [mostAssistsPlayer, setMostAssistsPlayer] = useState("");
  const [mostPenaltyMinutesPlayer, setmostPenaltyMinutesPlayer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profileUsername, setProfileUsername] = useState("");

  const navigate = useNavigate();

  function handleHomePageClick() {
    navigate("/");
  }
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`http://localhost:5000/getUsername?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setProfileUsername(data.username);
      })
      .catch((error) => {
        console.error("Error fetching username:", error);
      });
  }, []);
  const handleLogoutClick = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    navigate("/");
  };

  useEffect(() => {
    fetchGameDates();
  }, []);

  const fetchGameDates = async () => {
    try {
      const response = await axios.get("http://localhost:5000/gamedates", {
        params: {
          teamName: "Boston Bruins",
        },
      });
      const dates = response.data;
      setGameDates(dates);
      if (dates.length > 0) {
        setSelectedGameDate(dates[0]?.date || "");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchForwardPlayers = async (selectedDate) => {
    try {
      const response = await axios.get("http://localhost:5000/forwardplayers", {
        params: {
          gameDate: selectedDate,
          teamName: "Boston Bruins",
        },
      });
      const players = response.data;
      setForwardPlayers(players);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDefensivePlayers = async (selectedDate) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/defensiveplayers",
        {
          params: {
            gameDate: selectedDate,
            teamName: "Boston Bruins",
          },
        }
      );
      const players = response.data;
      setDefensivePlayers(players);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGameDateChange = (e) => {
    const selectedDate = e.target.value;
    setSelectedGameDate(selectedDate);

    if (selectedDate) {
      fetchForwardPlayers(selectedDate);
      fetchDefensivePlayers(selectedDate);
    } else {
      setForwardPlayers([]);
      setDefensivePlayers([]);
    }
  };

  const handleForwardPlayerChange = (e, index) => {
    const selectedPlayer = e.target.value;
    setSelectedForwardPlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];

      updatedPlayers.forEach((player, i) => {
        if (i !== index && player && player === selectedPlayer) {
          updatedPlayers[i] = "";
        }
      });

      updatedPlayers[index] = selectedPlayer;

      return updatedPlayers;
    });
  };

  const handleDefensivePlayerChange = (e, index) => {
    const selectedPlayer = e.target.value;
    setSelectedDefensivePlayers((prevPlayers) => {
      const updatedPlayers = [...prevPlayers];

      updatedPlayers.forEach((player, i) => {
        if (i !== index && player && player === selectedPlayer) {
          updatedPlayers[i] = "";
        }
      });

      updatedPlayers[index] = selectedPlayer;

      return updatedPlayers;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID not found in local storage");
      return;
    }
    console.log("UserId:", userId);
    const token = localStorage.getItem("authToken");
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = {
      teamName: "Boston Bruins",
      gameDate: selectedGameDate,
      forwardLineup: selectedForwardPlayers
        .filter((player) => player !== "")
        .map(
          (playerId) =>
            forwardPlayers.find((p) => p._id === playerId).playerName
        ),
      defensiveLineup: selectedDefensivePlayers
        .filter((player) => player !== "")
        .map(
          (playerId) =>
            defensivePlayers.find((p) => p._id === playerId).playerName
        ),
      userId: userId,
    };

    try {
      await axios.post("http://localhost:5000/saveSelection", data, {
        headers,
      });
      console.log("Selection saved successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCheck = async () => {
    try {
      const response = await axios.get("http://localhost:5000/gamelineup", {
        params: {
          gameDate: selectedGameDate,
          teamName: "Boston Bruins",
        },
      });
      const lineup = response.data;

      const selectedForwardLineup = selectedForwardPlayers
        .filter((playerId) => playerId)
        .map((playerId) => {
          const player = forwardPlayers.find((p) => p._id === playerId);
          return player ? player.playerName : "";
        });

      const selectedDefensiveLineup = selectedDefensivePlayers
        .filter((playerId) => playerId)
        .map((playerId) => {
          const player = defensivePlayers.find((p) => p._id === playerId);
          return player ? player.playerName : "";
        });

      checkLineupMatch(
        lineup,
        selectedForwardLineup,
        selectedDefensiveLineup,
        selectedGameDate
      );

      findMostStatsPlayers(
        selectedForwardPlayers,
        selectedDefensivePlayers,
        forwardPlayers,
        defensivePlayers
      );

      openModal();
    } catch (error) {
      console.log(error);
    }
  };

  const findMostStatsPlayers = (
    selectedForwardPlayers,
    selectedDefensivePlayers,
    forwardPlayers,
    defensivePlayers
  ) => {
    let mostGoalsPlayer = null;
    let mostAssistsPlayer = null;
    let mostPenaltyMinutesPlayer = null;
    let mostGoals = 0;
    let mostAssists = 0;
    let mostPenaltyMinutes = 0;

    for (const playerId of selectedForwardPlayers) {
      if (!playerId) continue;
      const player = forwardPlayers.find((p) => p._id === playerId);
      if (!player) continue;
      if (player.goals > mostGoals) {
        mostGoals = player.goals;
        mostGoalsPlayer = player.playerName;
      }
      if (player.assists > mostAssists) {
        mostAssists = player.assists;
        mostAssistsPlayer = player.playerName;
      }
      if (player.PIM > mostPenaltyMinutes) {
        mostPenaltyMinutes = player.PIM;
        mostPenaltyMinutesPlayer = player.playerName;
      }
    }

    for (const playerId of selectedDefensivePlayers) {
      if (!playerId) continue;
      const player = defensivePlayers.find((p) => p._id === playerId);
      if (!player) continue;
      if (player.goals > mostGoals) {
        mostGoals = player.goals;
        mostGoalsPlayer = player.playerName;
      }
      if (player.assists > mostAssists) {
        mostAssists = player.assists;
        mostAssistsPlayer = player.playerName;
      }
      if (player.PIM > mostPenaltyMinutes) {
        mostPenaltyMinutes = player.PIM;
        mostPenaltyMinutesPlayer = player.playerName;
      }
    }
    setMostGoalsPlayer(mostGoalsPlayer);
    setMostAssistsPlayer(mostAssistsPlayer);
    setmostPenaltyMinutesPlayer(mostPenaltyMinutesPlayer);
  };

  const getBestForwardPlayers = (lineup) => {
    const bestForwardLineup = lineup.find(
      (item) => item.position === "forward" && item.type === "best lineup"
    );
    return bestForwardLineup ? bestForwardLineup.lineup : [];
  };

  const getGoodForwardPlayers = (lineup) => {
    const goodForwardLineup = lineup.find(
      (item) => item.position === "forward" && item.type === "good lineup"
    );
    return goodForwardLineup ? goodForwardLineup.lineup : [];
  };

  const getWorstForwardPlayers = (lineup) => {
    const worstForwardLineup = lineup.find(
      (item) => item.position === "forward" && item.type === "worst lineup"
    );
    return worstForwardLineup ? worstForwardLineup.lineup : [];
  };
  const getBestDefensivePlayers = (lineup) => {
    const bestDefensiveLineup = lineup.find(
      (item) => item.position === "defense" && item.type === "best lineup"
    );
    return bestDefensiveLineup ? bestDefensiveLineup.lineup : [];
  };

  const getGoodDefensivePlayers = (lineup) => {
    const goodDefensiveLineup = lineup.find(
      (item) => item.position === "defense" && item.type === "good lineup"
    );
    return goodDefensiveLineup ? goodDefensiveLineup.lineup : [];
  };

  const getWorstDefensivePlayers = (lineup) => {
    const worstDefensiveLineup = lineup.find(
      (item) => item.position === "defense" && item.type === "worst lineup"
    );
    return worstDefensiveLineup ? worstDefensiveLineup.lineup : [];
  };

  const normalize = (player) => player.replace(/\s/g, "").toLowerCase();

  const displayOriginalName = (normalizedName, originalNamesArray) => {
    const originalName = originalNamesArray.find(
      (name) => normalize(name) === normalizedName
    );
    return originalName || normalizedName;
  };

  const checkLineupMatch = (
    lineup,
    selectedForwardLineup,
    selectedDefensiveLineup
  ) => {
    let forwardMatch = false;
    let defensiveMatch = false;
    let forwardMatchType = "";
    let defensiveMatchType = "";
    let advice = "";

    for (const item of lineup) {
      if (
        item.position === "forward" &&
        isSameLineup(selectedForwardLineup, item.lineup)
      ) {
        forwardMatch = true;
        forwardMatchType = item.type;
      }
    }

    const bestForwardPlayers = getBestForwardPlayers(lineup);
    const goodForwardPlayers = getGoodForwardPlayers(lineup);
    const worstForwardPlayers = getWorstForwardPlayers(lineup);

    const isBestLineup = isSameLineup(
      selectedForwardLineup,
      bestForwardPlayers
    );
    const isGoodLineup = isSameLineup(
      selectedForwardLineup,
      goodForwardPlayers
    );
    const isWorstLineup = isSameLineup(
      selectedForwardLineup,
      worstForwardPlayers
    );
    const normalizedSelectedForwardLineup = selectedForwardLineup.map(
      (player) => normalize(player)
    );
    const bestForwardPlayersNormalized = bestForwardPlayers.map((player) =>
      normalize(player)
    );
    const goodForwardPlayersNormalized = goodForwardPlayers.map((player) =>
      normalize(player)
    );
    const worstForwardPlayersNormalized = worstForwardPlayers.map((player) =>
      normalize(player)
    );
    let missingBestPlayers;
    let missingGoodPlayers;
    let missingWorstPlayers;

    if (!isGoodLineup && !isBestLineup && !isWorstLineup) {
      missingBestPlayers = bestForwardPlayersNormalized.filter(
        (player) => !normalizedSelectedForwardLineup.includes(player)
      );
      missingGoodPlayers = goodForwardPlayersNormalized.filter(
        (player) => !normalizedSelectedForwardLineup.includes(player)
      );
      missingWorstPlayers = worstForwardPlayersNormalized.filter(
        (player) => !normalizedSelectedForwardLineup.includes(player)
      );
      if (missingBestPlayers.length === 2) {
        advice += `You have one player from the best forward lineup. Consider adding: ${missingBestPlayers
          .map((player) => displayOriginalName(player, bestForwardPlayers))
          .join(", ")}. `;
      } else if (missingBestPlayers.length === 1) {
        advice += `You have two players from the best forward lineup. Consider adding: ${missingBestPlayers
          .map((player) => displayOriginalName(player, bestForwardPlayers))
          .join(", ")}.  `;
      } else if (missingGoodPlayers.length === 2) {
        advice += `You have one player from the good forward lineup. Consider adding: ${missingGoodPlayers
          .map((player) => displayOriginalName(player, goodForwardPlayers))
          .join(", ")}. `;
      } else if (missingGoodPlayers.length === 1) {
        advice += `You have two players from the good forward lineup. Consider adding: ${missingGoodPlayers
          .map((player) => displayOriginalName(player, goodForwardPlayers))
          .join(", ")}. `;
      } else if (missingWorstPlayers.length > 0) {
        advice += `You also have players from the worst forward lineup. Consider choosing from the best lineup: ${bestForwardPlayers.join(
          ", "
        )}. `;
      }
    }
    if (isWorstLineup) {
      advice += `You have players from the worst forward lineup. Consider choosing from the best lineup: ${bestForwardPlayers.join(
        ", "
      )}.  `;
    }

    for (const item of lineup) {
      if (
        item.position === "defense" &&
        isSameLineup(selectedDefensiveLineup, item.lineup)
      ) {
        defensiveMatch = true;
        defensiveMatchType = item.type;
      }
    }

    const bestDefensivePlayers = getBestDefensivePlayers(lineup);
    const goodDefensivePlayers = getGoodDefensivePlayers(lineup);
    const worstDefensivePlayers = getWorstDefensivePlayers(lineup);
    const isBestDefensiveLineup = isSameLineup(
      selectedDefensiveLineup,
      bestDefensivePlayers
    );
    const isGoodDefensiveLineup = isSameLineup(
      selectedDefensiveLineup,
      goodDefensivePlayers
    );
    const isWorstDefensiveLineup = isSameLineup(
      selectedDefensiveLineup,
      worstDefensivePlayers
    );
    const normalizedSelectedDefensiveLineup = selectedDefensiveLineup.map(
      (player) => normalize(player)
    );
    const bestDefensivePlayersNormalized = bestDefensivePlayers.map((player) =>
      normalize(player)
    );
    const goodDefensivePlayersNormalized = goodDefensivePlayers.map((player) =>
      normalize(player)
    );
    const worstDefensivePlayersNormalized = worstDefensivePlayers.map(
      (player) => normalize(player)
    );

    let missingBestDefensivePlayers;
    let missingGoodDefensivePlayers;
    let missingWorstDefensivePlayers;
    if (
      !isGoodDefensiveLineup &&
      !isBestDefensiveLineup &&
      !isWorstDefensiveLineup
    ) {
      missingBestDefensivePlayers = bestDefensivePlayersNormalized.filter(
        (player) => !normalizedSelectedDefensiveLineup.includes(player)
      );
      missingGoodDefensivePlayers = goodDefensivePlayersNormalized.filter(
        (player) => !normalizedSelectedDefensiveLineup.includes(player)
      );
      missingWorstDefensivePlayers = worstDefensivePlayersNormalized.filter(
        (player) => !normalizedSelectedDefensiveLineup.includes(player)
      );

      if (missingBestDefensivePlayers.length === 1) {
        advice += `You have one player from the best defensive lineup. Consider adding: ${missingBestDefensivePlayers
          .map((player) => displayOriginalName(player, bestDefensivePlayers))
          .join(", ")}. `;
      } else if (missingGoodDefensivePlayers.length === 1) {
        advice += `You have one player from the good defensive lineup. Consider adding: ${missingGoodDefensivePlayers
          .map((player) => displayOriginalName(player, goodDefensivePlayers))
          .join(", ")}. `;
      } else if (missingWorstDefensivePlayers.length > 0) {
        advice += `You also have players from the worst defensive lineup. Consider choosing from the best lineup: ${bestDefensivePlayers.join(
          ", "
        )}. `;
      }
    }

    if (isWorstDefensiveLineup) {
      advice += `You have players from the worst defensive lineup. Consider choosing from the best lineup: ${bestDefensivePlayers.join(
        ", "
      )}. `;
    }
    setAdvice(advice);

    if (forwardMatch && defensiveMatch) {
      setLineupMatchup(
        `Forward lineup matches ${forwardMatchType}. Defensive lineup matches ${defensiveMatchType}.`
      );
    } else if (forwardMatch) {
      setLineupMatchup(`Forward lineup matches ${forwardMatchType}.`);
    } else if (defensiveMatch) {
      setLineupMatchup(`Defensive lineup matches ${defensiveMatchType}.`);
    } else {
      setLineupMatchup("");
    }
  };

  const isSameLineup = (lineup1, lineup2) => {
    if (
      !Array.isArray(lineup1) ||
      !Array.isArray(lineup2) ||
      lineup1.length !== lineup2.length
    ) {
      return false;
    }

    for (const player of lineup1) {
      const normalizedPlayer = normalize(player);
      if (!lineup2.some((player2) => normalize(player2) === normalizedPlayer)) {
        return false;
      }
    }

    for (const player of lineup2) {
      const normalizedPlayer = normalize(player);
      if (!lineup1.some((player1) => normalize(player1) === normalizedPlayer)) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="background-container">
      <div className="lineup-navbar">
          <div className="lineupnav-left">
            <ul className="lineup-navmenu">
              <li>
                <a href="/" onClick={handleHomePageClick}>
                  <img className="home-logo" src={homeLogo} alt="Home" />
                </a>
              </li>
            </ul>
          </div>
          <div className="lineupnav-right">
            <div className="dropdown">
              <button className="profile-dropbtn">{`${profileUsername}`}</button>
              <div className="profile-dropdown-content">
                <Link to="/profile" className="drop-con">
                  View Profile
                </Link>
                <button className="drop-con" onClick={handleLogoutClick}>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      <div className="container">
        <h2>Game Lineup</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="gameDate">Select Game Date:</label>
            <select
              id="gameDate"
              value={selectedGameDate}
              onChange={handleGameDateChange}
            >
              <option value="" hidden>
                ---
              </option>
              {gameDates.map((date) => (
                <option key={date._id} value={date.date}>
                  {date.gameDate}
                </option>
              ))}
            </select>
          </div>
          {selectedGameDate && (
            <div className="lineup-section">
              <h3>Forward Lineup</h3>
              {selectedForwardPlayers.map((selectedPlayer, index) => (
                <div key={index}>
                  <label htmlFor={`forwardPlayer${index}`}>
                    Select Forward Player {index + 1}:
                  </label>
                  <select
                    id={`forwardPlayer${index}`}
                    value={selectedPlayer}
                    onChange={(e) => handleForwardPlayerChange(e, index)}
                  >
                    <option value="">---</option>
                    {forwardPlayers.map((player) => (
                      <option key={player._id} value={player._id}>
                        {player.playerName}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
          {selectedGameDate && (
            <div className="lineup-section">
              <h3>Defensive Lineup</h3>
              {selectedDefensivePlayers.map((selectedPlayer, index) => (
                <div key={index}>
                  <label htmlFor={`defensivePlayer${index}`}>
                    Select Defensive Player {index + 1}:
                  </label>
                  <select
                    id={`defensivePlayer${index}`}
                    value={selectedPlayer}
                    onChange={(e) => handleDefensivePlayerChange(e, index)}
                  >
                    <option value="">---</option>
                    {defensivePlayers.map((player) => (
                      <option key={player._id} value={player._id}>
                        {player.playerName}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
          <div className="buttons">
            <button type="submit">Save Selection</button>
            <button type="button" onClick={handleCheck}>
              Check
            </button>
            <ResultModal
              isOpen={isModalOpen}
              closeModal={closeModal}
              lineupMatchup={lineupMatchup}
              advice={advice}
              mostGoalsPlayer={mostGoalsPlayer}
              mostAssistsPlayer={mostAssistsPlayer}
              mostPenaltyMinutesPlayer={mostPenaltyMinutesPlayer}
            />
          </div>
          <div></div>
        </form>
        <footer className="team-footer">
          <div className="teamfooter-content">
            <p>&copy; 2023 FERIT All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default BostonBruins;
