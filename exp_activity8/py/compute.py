import json
import networkx as nx
from networkx.readwrite import json_graph
import random

G = nx.DiGraph()

#
# Updates the weight attribute of edges along the path, based off the winner.
#
# Adds one to the weight attribute of edges that travel [winner]->[lower] and
# subtracts one from the weight attribute of edges that travel [loser]->[winner].
#
# See full details at:
#  https://courses.engr.illinois.edu/cs199205/activity/10.php
#
def updateEdgesBasedOnPath(G, path):











# Picks an edge, favoring positive-weight edges
def pickEdge(cur_state, next_states):
    if len(next_states) == 1:
        return next_states[0]
    else:
        n1 = next_states[0]
        n2 = next_states[1]

        w1 = G[cur_state][n1]["weight"] + 100
        w2 = G[cur_state][n1]["weight"] + 100

        if w1 < 2:
            w1 = 2
        if w2 < 2:
            w2 = 2

        r = random.randint(0, w1+w2-1)
        if r < w1:
            return n1
        else:
            return n2

# Generate the nodes in our state tree
for player in [1, 2]:
    for marks in range(10 + 1):
        state = "p" + str(player) + "-" + str(marks)

        # Add the state to the graph
        G.add_node(state, player=player, marks=marks)

# Generate the edges between the nodes in our state tree
for node in G.nodes(data=True):
    node_id = node[0]
    node_attr = node[1]

    if node_attr["player"] == 1:
        new_player = 2
    else:
        new_player = 1

    if node_attr["marks"] >= 1:
        new_state = "p" + str(new_player) + "-" + \
                    str( node_attr["marks"] - 1 )

        G.add_edge(node_id, new_state, weight=100)

    if node_attr["marks"] >= 2:
        new_state = "p" + str(new_player) + "-" + \
                    str( node_attr["marks"] - 2 )

        G.add_edge(node_id, new_state, weight=100)

# Play the game once, returning the path
def generatePath():
    path = []

    # Start at "p1-10"
    cur = "p1-10"
    path.append(cur)

    # Find all of the edges leading out of "p1-10"
    next_ids = list(G[ cur ].keys())

    # While at least edge leading out of our node exists:
    while len(next_ids) > 0:
        # ...pick an edge randomly:
        #next_id = random.choice(next_ids)
        next_id = pickEdge(cur, next_ids)

        # ...follow the edge by setting our current node to the next_id:
        cur = next_id
        path.append(cur)
        next_ids = list(G[ cur ].keys())

    return path

# Play the game 100000 times, updating edges
for i in range(100000):
    path = generatePath()
    updateEdgesBasedOnPath(G, path)

# Save the graph
with open("res/graph.json", "w") as f:
    graphData = json_graph.node_link_data(G)
    json.dump(graphData, f, indent=2)
