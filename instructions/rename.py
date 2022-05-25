import os
import shutil

previous = [
    "3917033",
    "3917688",
    "3917132"
]

new = [
    "fi_rr_home",
    "fi_rr_user",
    "fi_rr_search"
]

def main():
	for idx, x in enumerate(previous):  
    		shutil.move('C:\\Users\\Slaviboy\\Desktop\\img\\' + previous[idx]+ '.svg', 'C:\\Users\\Slaviboy\\Desktop\\img\\' + new[idx]+ '.svg')

if __name__ == '__main__':
	main()
